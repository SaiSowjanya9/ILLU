import json
import logging
from json import JSONDecodeError

from pydantic import ValidationError

from app.models.customer_home_profile import CustomerHomeProfile
from app.schemas.illu_schema import IlluAnalyzeResponse
from app.services.azure_openai_service import AzureOpenAIService


logger = logging.getLogger(__name__)


class IlluAdvisor:
    """Understands customer requirements using Azure OpenAI."""

    def __init__(self) -> None:
        self.azure_service = AzureOpenAIService()

    def analyze(
        self,
        customer_message: str,
        current_profile: CustomerHomeProfile,
    ) -> IlluAnalyzeResponse:
        """Analyze a customer description and return structured profile data."""

        current_profile_json = current_profile.model_dump_json(indent=2)
        raw_response = self.azure_service.analyze_customer_message(
            customer_message=customer_message,
            current_profile_json=current_profile_json,
        )

        try:
            response_data = json.loads(raw_response)
        except JSONDecodeError as error:
            logger.exception("Azure OpenAI returned invalid JSON.")
            raise ValueError("Azure OpenAI returned invalid JSON.") from error

        self._normalize_numeric_profile_values(response_data)

        try:
            return IlluAnalyzeResponse.model_validate(response_data)
        except ValidationError as error:
            validation_details = "; ".join(
                f"{'.'.join(str(part) for part in issue['loc'])}: {issue['msg']}"
                for issue in error.errors()
            )
            logger.exception(
                "Azure OpenAI returned JSON that does not match the Home Profile schema: %s",
                validation_details,
            )
            raise ValueError(
                f"Azure OpenAI returned an invalid Home Profile response: {validation_details}"
            ) from error

    def _normalize_numeric_profile_values(self, response_data: object) -> None:
        """Convert numeric strings from Azure into the JSON numbers our schema expects."""

        if not isinstance(response_data, dict):
            return

        profile = response_data.get("profile")
        if not isinstance(profile, dict):
            return

        allowed_values = {
            "number_of_floors": {"1": 1, "2": 2, "3": 3},
            "bedrooms": {"2": 2, "3": 3, "4": 4, "5": 5},
            "bathrooms": {"2": 2, "2.5": 2.5, "3": 3, "3.5": 3.5},
        }

        for field_name, value_map in allowed_values.items():
            value = profile.get(field_name)
            if isinstance(value, str) and value in value_map:
                profile[field_name] = value_map[value]
