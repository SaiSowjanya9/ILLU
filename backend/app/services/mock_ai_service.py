import os
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()


class MockAIService:
    """
    Mock AI service for testing the UI without a real AI backend.
    Returns realistic sample responses based on keywords in the customer message.
    """

    def __init__(self) -> None:
        """Initialize the mock service."""
        pass

    def _get_prompt_path(self) -> Path:
        """Return the full path to Illu's system prompt file."""
        return (
            Path(__file__).resolve().parent.parent
            / "prompts"
            / "illu_system_prompt.txt"
        )

    def load_illu_system_prompt(self) -> str:
        """Read Illu's permanent instructions from the text file."""
        prompt_path = self._get_prompt_path()
        if not prompt_path.exists():
            return "Mock system prompt"
        return prompt_path.read_text(encoding="utf-8").strip()

    def analyze_customer_message(
        self,
        customer_message: str,
        current_profile_json: str,
    ) -> str:
        """
        Return a mock AI response based on the customer message.
        Extracts some keywords to make the response feel realistic.
        """
        
        message_lower = customer_message.lower()
        
        # Detect preferences from message - match frontend CustomerHomeProfile types
        home_style = None
        if "traditional" in message_lower:
            home_style = "Traditional"
        elif "contemporary" in message_lower:
            home_style = "Contemporary"
        elif "farmhouse" in message_lower:
            home_style = "Modern Farmhouse"
        elif "minimalist" in message_lower or "modern" in message_lower:
            home_style = "Modern"
        
        # Detect floors
        floors = None
        if "single story" in message_lower or "one story" in message_lower or "1 story" in message_lower:
            floors = 1
        elif "two story" in message_lower or "2 story" in message_lower or "two kids" in message_lower:
            floors = 2
        
        # Detect bedrooms
        bedrooms = None
        if "3 bed" in message_lower or "three bed" in message_lower:
            bedrooms = 3
        elif "5 bed" in message_lower or "five bed" in message_lower:
            bedrooms = 5
        elif "two kids" in message_lower or "2 kids" in message_lower or "young kids" in message_lower:
            bedrooms = 4
        elif "4 bed" in message_lower or "four bed" in message_lower:
            bedrooms = 4
        
        # Detect bathrooms
        bathrooms = None
        if "3 bath" in message_lower or "three bath" in message_lower:
            bathrooms = 3
        elif "4 bath" in message_lower or "four bath" in message_lower:
            bathrooms = 4
        elif "5 bath" in message_lower or "five bath" in message_lower:
            bathrooms = 5
        elif bedrooms:
            bathrooms = bedrooms  # Default: same as bedrooms
        
        # Detect office - match frontend type: 'Included' | 'Not Included' | 'Not selected'
        home_office = "Included" if "office" in message_lower or "work from home" in message_lower else None
        
        # Detect guest suite - match frontend type
        guest_suite = "Included" if "guest" in message_lower or "parents" in message_lower or "in-laws" in message_lower else None
        
        # Detect garage - match frontend type: 'No Garage' | '1-Car' | '2-Car' | '3-Car+' | 'Not selected'
        garage = None
        if "3 car" in message_lower or "three car" in message_lower:
            garage = "3-Car+"
        elif "2 car" in message_lower or "two car" in message_lower:
            garage = "2-Car"
        elif "1 car" in message_lower or "one car" in message_lower:
            garage = "1-Car"
        elif "no garage" in message_lower:
            garage = "No Garage"
        
        # Detect kitchen - match frontend type
        kitchen = None
        if "open kitchen" in message_lower or "open concept" in message_lower or "flows into" in message_lower:
            kitchen = "Open Kitchen"
        elif "chef" in message_lower:
            kitchen = "Chef's Kitchen"
        
        # Detect outdoor/patio - match frontend type: 'Included' | 'Not Included' | 'Not selected'
        outdoor = None
        if "patio" in message_lower or "outdoor" in message_lower or "pool" in message_lower or "backyard" in message_lower:
            outdoor = "Included"
        
        # Build response message
        message_parts = ["Thank you for sharing your vision!"]
        
        detected = []
        if home_style:
            detected.append(f"a {home_style.lower()} style")
        if floors:
            detected.append(f"{floors}-story layout")
        if bedrooms:
            detected.append(f"{bedrooms} bedrooms")
        if bathrooms:
            detected.append(f"{bathrooms} bathrooms")
        
        if detected:
            message_parts.append(f"I can see you're looking for {', '.join(detected)}.")
        
        if home_office:
            message_parts.append("I've noted the need for a dedicated home office.")
        if guest_suite:
            message_parts.append("A guest suite is included for when family visits.")
        if kitchen:
            message_parts.append(f"You'll have an {kitchen.lower()}.")
        
        # Find missing fields to ask about
        missing = []
        if not home_style:
            missing.append("home style")
        if not floors:
            missing.append("number of floors")
        if not garage:
            missing.append("garage size")
        if not outdoor:
            missing.append("outdoor space preferences")
        
        needs_follow_up = len(missing) > 0
        follow_up = None
        if missing:
            follow_up = f"Could you tell me about your preferred {missing[0]}?"
        
        illu_message = " ".join(message_parts)
        
        # Build field_sources based on what was detected
        field_sources = {}
        if home_style:
            field_sources["home_style"] = "customer"
        if floors:
            field_sources["number_of_floors"] = "customer"
        if bedrooms:
            field_sources["bedrooms"] = "customer"
        if bathrooms:
            field_sources["bathrooms"] = "customer"
        if garage:
            field_sources["garage"] = "customer"
        if home_office:
            field_sources["home_office"] = "customer"
        if guest_suite:
            field_sources["guest_suite"] = "customer"
        if outdoor:
            field_sources["covered_patio"] = "customer"
        if kitchen:
            field_sources["kitchen_type"] = "customer"
        
        # Build response JSON matching IlluAnalyzeResponse type
        import json
        response_dict = {
            "profile": {
                "home_style": home_style if home_style else "Not selected",
                "number_of_floors": floors,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "garage": garage if garage else "Not selected",
                "home_office": home_office if home_office else "Not selected",
                "guest_suite": guest_suite if guest_suite else "Not selected",
                "covered_patio": outdoor if outdoor else "Not selected",
                "kitchen_type": kitchen if kitchen else "Not selected",
                "material_package": "Not selected"
            },
            "field_sources": field_sources,
            "illu_message": illu_message,
            "needs_follow_up": needs_follow_up,
            "follow_up_question": follow_up,
            "confidence": 0.85 if len(detected) >= 3 else 0.6
        }
        
        return json.dumps(response_dict, indent=2)
