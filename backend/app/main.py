from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.illu import router as illu_router

app = FastAPI(title="Illu Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(illu_router)


@app.get("/")
def home():
    return {"message": "Illu backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    return {"database": "connected"}
