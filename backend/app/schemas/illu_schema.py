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

    model_config = ConfigDict(extra="allow")

    home_style: Optional[FieldSource] = "missing"
    number_of_floors: Optional[FieldSource] = "missing"
    bedrooms: Optional[FieldSource] = "missing"
    bathrooms: Optional[FieldSource] = "missing"
    garage: Optional[FieldSource] = "missing"
    home_office: Optional[FieldSource] = "missing"
    guest_suite: Optional[FieldSource] = "missing"
    covered_patio: Optional[FieldSource] = "missing"
    kitchen_type: Optional[FieldSource] = "missing"
    material_package: Optional[FieldSource] = "missing"


class IlluAnalyzeResponse(BaseModel):
    """Illu's structured interpretation of the customer's message."""

    model_config = ConfigDict(extra="forbid")

    illu_message: str
    profile: CustomerHomeProfile
    field_sources: FieldSources = Field(default_factory=FieldSources)
    needs_follow_up: bool = False
    follow_up_question: Optional[str] = None
    confidence: float = 0.0
