from typing import Optional

from pydantic import BaseModel, ConfigDict


class CustomerHomeProfile(BaseModel):
    """The ten selections displayed on the Home Profile screen."""

    model_config = ConfigDict(extra="forbid")

    home_style: str = "Not selected"
    number_of_floors: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    garage: str = "Not selected"
    home_office: str = "Not selected"
    guest_suite: str = "Not selected"
    covered_patio: str = "Not selected"
    kitchen_type: str = "Not selected"
    material_package: str = "Not selected"
