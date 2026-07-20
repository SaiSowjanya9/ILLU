from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict


class CustomerHomeProfile(BaseModel):
    """The ten selections displayed on the Home Profile screen."""

    model_config = ConfigDict(extra="forbid")

    home_style: Literal["Modern", "Modern Farmhouse", "Traditional", "Other", "Not selected"] = "Not selected"
    number_of_floors: Optional[Literal[1, 2, 3]] = None
    bedrooms: Optional[Literal[2, 3, 4, 5]] = None
    bathrooms: Optional[Literal[2, 2.5, 3, 3.5]] = None
    garage: Literal["No Garage", "1-Car", "2-Car", "3-Car+", "Not selected"] = "Not selected"
    home_office: Literal["Included", "Not Included", "Not selected"] = "Not selected"
    guest_suite: Literal["Included", "Not Included", "Not selected"] = "Not selected"
    covered_patio: Literal["Included", "Not Included", "Not selected"] = "Not selected"
    kitchen_type: Literal["Open Kitchen", "Closed Kitchen", "Chef's Kitchen", "Not selected"] = "Not selected"
    material_package: Literal["Essential", "Premium", "Luxury", "Not selected"] = "Not selected"
