from fastapi import FastAPI
from api.scan_routes import router as scan_router

app = FastAPI(title="Risk Mapper")
app.include_router(scan_router)