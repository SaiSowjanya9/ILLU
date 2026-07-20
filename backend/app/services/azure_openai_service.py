import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI


# Load values from backend/.env into Python environment variables.
load_dotenv()


class AzureOpenAIService:
    """
    Handles communication between the Illu backend and Azure OpenAI.

    Responsibilities:
    - Read Azure credentials from environment variables.
    - Load Illu's system prompt from the prompt text file.
    - Send the customer description and current profile to Azure.
    - Return the model response as raw text.

    This service does not parse the JSON response or update the customer
    profile. Those responsibilities belong to IlluAdvisor.
    """

    def __init__(self) -> None:
        """Read configuration and create a reusable Azure OpenAI client."""

        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT")

        self._validate_configuration()

        base_url = self._build_base_url()

        self.client = OpenAI(
            api_key=self.api_key,
            base_url=base_url,
        )

    def _validate_configuration(self) -> None:
        """Raise a clear error when required Azure settings are missing."""

        if not self.endpoint:
            raise ValueError(
                "AZURE_OPENAI_ENDPOINT is missing from backend/.env"
            )

        if not self.api_key:
            raise ValueError(
                "AZURE_OPENAI_API_KEY is missing from backend/.env"
            )

        if not self.deployment_name:
            raise ValueError(
                "AZURE_OPENAI_DEPLOYMENT is missing from backend/.env"
            )

    def _build_base_url(self) -> str:
        """
        Build the Azure OpenAI v1 API base URL.

        This accepts either of these values in .env:

        https://resource-name.openai.azure.com

        or

        https://resource-name.openai.azure.com/openai/v1
        """

        endpoint = self.endpoint.rstrip("/")

        if endpoint.endswith("/openai/v1"):
            return f"{endpoint}/"

        return f"{endpoint}/openai/v1/"

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
        Ask Azure OpenAI to analyze a customer description.

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
            response = self.client.responses.create(
                model=self.deployment_name,
                instructions=system_prompt,
                input=user_input,
            )
        except Exception as error:
            raise RuntimeError(
                "Azure OpenAI could not analyze the customer message."
            ) from error

        output_text = response.output_text

        if not output_text or not output_text.strip():
            raise ValueError(
                "Azure OpenAI returned an empty response."
            )

        return output_text.strip()
