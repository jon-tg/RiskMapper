from fastapi import APIRouter
from scanners.nmap_scanner import scan_host

router = APIRouter(prefix="/scan")

@router.post("/")
async def run_scan(target: str):
    return scan_host(target)