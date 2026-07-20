import logging

from fastapi import APIRouter, HTTPException

from app.advisors.illu_advisor import IlluAdvisor
from app.schemas.illu_schema import IlluAnalyzeRequest, IlluAnalyzeResponse


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/illu", tags=["Illu"])

illu_advisor = IlluAdvisor()


@router.post("/analyze", response_model=IlluAnalyzeResponse)
def analyze_home_requirements(request: IlluAnalyzeRequest) -> IlluAnalyzeResponse:
    """Analyze a customer message and return the updated home profile."""

    try:
        return illu_advisor.analyze(
            customer_message=request.customer_message,
            current_profile=request.current_profile,
        )
    except (RuntimeError, ValueError) as error:
        logger.exception("Illu could not analyze the customer description.")
        raise HTTPException(status_code=502, detail=str(error)) from error
