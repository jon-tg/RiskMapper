from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.scan_routes import router as scan_router
from api.scan_risks import router as risk_router
from scanners.risk_scanner import init_cve_cache

init_cve_cache()
app = FastAPI(title="Risk Mapper")

allowed_origins = ["https://risk-mapper.vercel.app", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router)
app.include_router(risk_router)