from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.scan_routes import router as scan_router
from api.scan_risks import router as risk_router

app = FastAPI(title="Risk Mapper")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router)
app.include_router(risk_router)