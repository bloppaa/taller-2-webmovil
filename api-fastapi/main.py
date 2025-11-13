from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from routers import games_router

app = FastAPI(
    title="🎮 Video Games API",
    description="API para buscar y filtrar videojuegos - Taller 2 Web Móvil",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evento de startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Incluir routers
app.include_router(games_router)

@app.get("/")
def read_root():
    return {
        "message": "🎮 Video Games API funcionando correctamente",
        "docs": "/docs",
        "endpoints": {
            "search_games": "/games/search",
            "get_genres": "/games/genres", 
            "get_platforms": "/games/platforms",
            "get_game_detail": "/games/{id}"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "games-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002, reload=True)