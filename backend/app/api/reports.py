from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.services.report_service import (
    get_reports,
    get_my_reports,
    get_report_by_id,
    create_report,
    update_report,
    delete_report
)
from app.schemas.report import ReportResponse, ReportCreateRequest, ReportUpdateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext
from app.core.supabase_auth import get_authenticated_supabase_client

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def read_reports():
    """Public endpoint to list reports."""
    return get_reports(limit=50)

@router.get("/me", response_model=List[ReportResponse])
def read_my_reports(current_user: UserAuthContext = Depends(get_current_user)):
    """Protected endpoint to list authenticated user's reports."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return get_my_reports(user_id=current_user.user_id, client=auth_client, limit=50)

@router.get("/{report_id}", response_model=ReportResponse)
def read_report(
    report_id: UUID,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to get a single report by ID. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return get_report_by_id(report_id=report_id, client=auth_client)

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def submit_report(
    payload: ReportCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to submit a new report. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return create_report(user_id=current_user.user_id, client=auth_client, payload=payload)

@router.patch("/{report_id}", response_model=ReportResponse)
def update_existing_report(
    report_id: UUID,
    payload: ReportUpdateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected officer/admin endpoint to update report status or link incident. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return update_report(report_id=report_id, client=auth_client, payload=payload)

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_report(
    report_id: UUID,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected admin endpoint to delete a report. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    delete_report(report_id=report_id, client=auth_client)
    return None
