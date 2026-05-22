from fastapi import APIRouter
from scanners.nmap_scanner import scan_host
from pydantic import BaseModel

class ScanRequest(BaseModel):
    target: str

router = APIRouter(prefix="/scan")

@router.post("/")
async def run_scan(request: ScanRequest):
    return scan_host(request.target)