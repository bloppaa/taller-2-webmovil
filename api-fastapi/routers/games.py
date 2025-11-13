from fastapi import APIRouter, HTTPException, Query, Depends
from sqlmodel import Session, select
import requests
import json
from typing import Optional

from app.config import RAWG_API_KEY, RAWG_BASE_URL
from app.database import get_session
from models.game_models import Game, SearchHistory

# ✅ AÑADE ESTA LÍNEA - Definir el router
router = APIRouter(prefix="/games", tags=["games"])

# Ahora sí puedes usar @router.get()
@router.get("/search")
def search_games(
    query: Optional[str] = Query(None, description="Nombre del juego"),
    genre: Optional[str] = Query(None, description="Género (acción, aventura, RPG)"),
    platform: Optional[str] = Query(None, description="Plataforma (pc, playstation, xbox)"),
    ordering: Optional[str] = Query("-rating", description="Ordenar por rating, nombre, etc."),
    page: int = Query(1, description="Página de resultados"),
    page_size: int = Query(12, description="Resultados por página"),
    session: Session = Depends(get_session)
):
    try:
        # Verificar que tenemos API Key
        if not RAWG_API_KEY or RAWG_API_KEY == "tu_key_real_aqui":
            raise HTTPException(status_code=400, detail="API Key de RAWG no configurada")
        
        # Construir parámetros
        params = {
            "key": RAWG_API_KEY,
            "page": page,
            "page_size": page_size,
            "ordering": ordering
        }
        
        if query:
            params["search"] = query
        if genre:
            params["genres"] = genre
        if platform:
            params["platforms"] = platform
        
        print(f"🔍 Buscando juegos con parámetros: {params}")
        
        # Llamar a RAWG API con timeout
        try:
            response = requests.get(
                f"{RAWG_BASE_URL}/games", 
                params=params, 
                timeout=30,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
            )
            
            print(f"📡 Status Code: {response.status_code}")
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, 
                    detail=f"Error en RAWG API: {response.text}"
                )
            
            data = response.json()
            
        except requests.exceptions.Timeout:
            raise HTTPException(status_code=408, detail="Timeout al conectar con RAWG API")
        except requests.exceptions.ConnectionError:
            raise HTTPException(status_code=503, detail="Error de conexión con RAWG API")
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Error en la solicitud: {str(e)}")
        
        # Guardar historial de búsqueda
        search_history = SearchHistory(
            query=query or "",
            genre=genre,
            platform=platform,
            results_count=data.get("count", 0)
        )
        session.add(search_history)
        
        # Procesar y guardar juegos
        saved_games = []
        for game_data in data.get("results", []):
            existing_game = session.exec(
                select(Game).where(Game.rawg_id == game_data["id"])
            ).first()
            
            if not existing_game:
                # Convertir listas a JSON
                genres_json = json.dumps([g["name"] for g in game_data.get("genres", [])])
                platforms_json = json.dumps([
                    p["platform"]["name"] for p in game_data.get("platforms", [])
                ])
                
                game = Game(
                    rawg_id=game_data["id"],
                    name=game_data["name"],
                    slug=game_data.get("slug"),
                    released=game_data.get("released"),
                    rating=game_data.get("rating"),
                    background_image=game_data.get("background_image"),
                    genres=genres_json,
                    platforms=platforms_json
                )
                session.add(game)
                saved_games.append(game)
            else:
                saved_games.append(existing_game)
        
        session.commit()
        
        # Preparar respuesta
        games_response = []
        for game in saved_games:
            game_dict = game.dict()
            game_dict["genres"] = json.loads(game.genres) if game.genres else []
            game_dict["platforms"] = json.loads(game.platforms) if game.platforms else []
            games_response.append(game_dict)
        
        return {
            "count": data.get("count", 0),
            "results": games_response,
            "filters_applied": {
                "query": query,
                "genre": genre,
                "platform": platform
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/genres")
def get_genres():
    try:
        response = requests.get(f"{RAWG_BASE_URL}/genres?key={RAWG_API_KEY}", timeout=10)
        data = response.json()
        
        genres = []
        for genre in data.get("results", []):
            genres.append({
                "id": genre["id"],
                "name": genre["name"],
                "games_count": genre["games_count"]
            })
        
        return genres
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/platforms")
def get_platforms():
    try:
        response = requests.get(f"{RAWG_BASE_URL}/platforms?key={RAWG_API_KEY}", timeout=10)
        data = response.json()
        
        platforms = []
        for platform in data.get("results", []):
            platforms.append({
                "id": platform["id"],
                "name": platform["name"],
                "games_count": platform["games_count"]
            })
        
        return platforms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/diagnostic")
def api_diagnostic():
    """Diagnóstico de la conexión con RAWG"""
    try:
        # Probar conexión básica
        test_response = requests.get(f"{RAWG_BASE_URL}/genres?key={RAWG_API_KEY}", timeout=10)
        
        return {
            "status": "success",
            "rawg_api_status": test_response.status_code,
            "api_key_configured": bool(RAWG_API_KEY and RAWG_API_KEY != "tu_key_real_aqui"),
            "message": "✅ Conexión con RAWG API exitosa" if test_response.status_code == 200 else "❌ Error con RAWG API"
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "api_key_configured": bool(RAWG_API_KEY and RAWG_API_KEY != "tu_key_real_aqui"),
            "message": "❌ Error de conexión"
        }
    
@router.get("/{game_id}")
def get_game_detail(game_id: int, session: Session = Depends(get_session)):
    try:
        # Buscar en base de datos
        game = session.exec(select(Game).where(Game.rawg_id == game_id)).first()
        
        if not game:
            # Buscar en RAWG
            response = requests.get(f"{RAWG_BASE_URL}/games/{game_id}?key={RAWG_API_KEY}", timeout=10)
            
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Juego no encontrado")
            
            game_data = response.json()
            
            # Guardar en BD
            genres_json = json.dumps([g["name"] for g in game_data.get("genres", [])])
            platforms_json = json.dumps([
                p["platform"]["name"] for p in game_data.get("platforms", [])
            ])
            
            game = Game(
                rawg_id=game_data["id"],
                name=game_data["name"],
                slug=game_data.get("slug"),
                released=game_data.get("released"),
                rating=game_data.get("rating"),
                background_image=game_data.get("background_image"),
                genres=genres_json,
                platforms=platforms_json
            )
            session.add(game)
            session.commit()
            session.refresh(game)
        
        # Convertir respuesta
        game_dict = game.dict()
        game_dict["genres"] = json.loads(game.genres) if game.genres else []
        game_dict["platforms"] = json.loads(game.platforms) if game.platforms else []
        
        return game_dict
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")