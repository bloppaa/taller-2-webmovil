from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from routes.games import router as games_router

app = FastAPI(
    title="Game Database API",
    description="An API to retrieve information about video games.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(games_router, prefix="/api")


@app.head("/")
def root():
    return Response(status_code=200)
