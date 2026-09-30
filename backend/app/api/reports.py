from fastapi import APIRouter, Depends, status
from typing import List, Dict, Any
from app.services.report_service import get_reports, get_my_reports, create_report
from app.schemas.report import ReportResponse, ReportCreateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def read_reports():
    return get_reports(limit=50)

@router.get("/me", response_model=List[ReportResponse])
def read_my_reports(current_user: UserAuthContext = Depends(get_current_user)):
    return get_my_reports(user_id=current_user.user_id, limit=50)

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def submit_report(
    payload: ReportCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    return create_report(user_id=current_user.user_id, payload=payload)
