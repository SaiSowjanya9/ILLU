from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.customer_home_profile import CustomerHomeProfile

FieldSource = Literal["customer", "illu", "manual", "missing"]


class FieldSelection(BaseModel):
    """A selected field value and where that selection came from."""

    value: Any = None
    source: FieldSource = "missing"


class IlluAnalyzeRequest(BaseModel):
    """Request sent by the frontend when the customer describes their home."""

    model_config = ConfigDict(extra="forbid")

    customer_message: str = Field(min_length=1)
    current_profile: CustomerHomeProfile = Field(default_factory=CustomerHomeProfile)


class FieldSources(BaseModel):
    """Source for each selection displayed on the Home Profile screen."""

    model_config = ConfigDict(extra="forbid")

    home_style: FieldSource = "missing"
    number_of_floors: FieldSource = "missing"
    bedrooms: FieldSource = "missing"
    bathrooms: FieldSource = "missing"
    garage: FieldSource = "missing"
    home_office: FieldSource = "missing"
    guest_suite: FieldSource = "missing"
    covered_patio: FieldSource = "missing"
    kitchen_type: FieldSource = "missing"
    material_package: FieldSource = "missing"


class IlluAnalyzeResponse(BaseModel):
    """Illu's structured interpretation of the customer's message."""

    model_config = ConfigDict(extra="forbid")

    illu_message: str
    profile: CustomerHomeProfile
    field_sources: FieldSources = Field(default_factory=FieldSources)
    needs_follow_up: bool = False
    follow_up_question: Optional[str] = None
    confidence: float = 0.0
