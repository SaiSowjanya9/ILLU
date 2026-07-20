from typing import Any, Dict, List

from app.models.customer_home_profile import CustomerHomeProfile


class CustomerProfileService:
    """Merges advisor updates into a customer home profile."""

    def merge_profile(
        self,
        current_profile: CustomerHomeProfile,
        profile_updates: Dict[str, Any],
        additional_notes: List[str],
    ) -> CustomerHomeProfile:
        """Return a new profile with updates and de-duplicated notes applied."""

        profile_data = self._to_dict(current_profile)
        existing_notes = profile_data.get("additional_notes", [])

        profile_data.update(profile_updates)
        profile_data["additional_notes"] = self._unique_notes(existing_notes + additional_notes)

        return CustomerHomeProfile(**profile_data)

    def _to_dict(self, profile: CustomerHomeProfile) -> Dict[str, Any]:
        """Support both Pydantic v1 and v2 model serialization."""

        if hasattr(profile, "model_dump"):
            return profile.model_dump()

        return profile.dict()

    def _unique_notes(self, notes: List[str]) -> List[str]:
        """Remove duplicate notes while preserving order."""

        unique_notes: List[str] = []
        for note in notes:
            if note and note not in unique_notes:
                unique_notes.append(note)

        return unique_notes
