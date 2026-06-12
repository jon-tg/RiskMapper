from fastapi import APIRouter
from scanners.risk_scanner import scan_risk
from pydantic import BaseModel

class ScanRequest(BaseModel):
    target: dict

router = APIRouter(prefix="/risk")

@router.post("/")
async def run_scan(request: ScanRequest):
    return scan_risk(request.target)