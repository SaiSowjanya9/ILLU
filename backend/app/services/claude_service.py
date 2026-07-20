import os
from pathlib import Path

from dotenv import load_dotenv
import anthropic


# Load values from backend/.env into Python environment variables.
load_dotenv()


class ClaudeService:
    """
    Handles communication between the Illu backend and Claude (Anthropic).

    Responsibilities:
    - Read Anthropic API credentials from environment variables.
    - Load Illu's system prompt from the prompt text file.
    - Send the customer description and current profile to Claude.
    - Return the model response as raw text.

    This service does not parse the JSON response or update the customer
    profile. Those responsibilities belong to IlluAdvisor.
    """

    def __init__(self) -> None:
        """Read configuration and create a reusable Anthropic client."""

        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.model_name = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")

        self._validate_configuration()

        self.client = anthropic.Anthropic(api_key=self.api_key)

    def _validate_configuration(self) -> None:
        """Raise a clear error when required Anthropic settings are missing."""

        if not self.api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY is missing from backend/.env"
            )

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
            raise FileNotFoundError(
                f"Illu system prompt was not found at: {prompt_path}"
            )

        system_prompt = prompt_path.read_text(
            encoding="utf-8"
        ).strip()

        if not system_prompt:
            raise ValueError(
                "Illu system prompt file is empty."
            )

        return system_prompt

    def analyze_customer_message(
        self,
        customer_message: str,
        current_profile_json: str,
    ) -> str:
        """
        Ask Claude to analyze a customer description.

        Parameters:
        - customer_message:
          The natural paragraph entered by the customer.

        - current_profile_json:
          The customer's existing home profile represented as JSON text.

        Returns:
        - The model response as raw text.

        IlluAdvisor will later parse and validate this text as JSON.
        """

        if not customer_message or not customer_message.strip():
            raise ValueError(
                "Customer message cannot be empty."
            )

        if not current_profile_json or not current_profile_json.strip():
            raise ValueError(
                "Current profile JSON cannot be empty."
            )

        system_prompt = self.load_illu_system_prompt()

        user_input = f"""
CURRENT CUSTOMER HOME PROFILE

{current_profile_json}

NEW CUSTOMER DESCRIPTION

{customer_message}

Analyze the customer's description.

Return the updated home profile using exactly the JSON structure
defined in your system instructions.

Return JSON only. Do not use Markdown code fences and do not include
any explanation before or after the JSON.
""".strip()

        try:
            response = self.client.messages.create(
                model=self.model_name,
                max_tokens=4096,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_input}
                ],
            )
        except Exception as error:
            raise RuntimeError(
                "Claude could not analyze the customer message."
            ) from error

        # Extract text from response
        output_text = ""
        for block in response.content:
            if hasattr(block, "text"):
                output_text += block.text

        if not output_text or not output_text.strip():
            raise ValueError(
                "Claude returned an empty response."
            )

        return output_text.strip()
