from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routes import router
from .config import Config
import os

def create_app() -> FastAPI:
    app = FastAPI(title="Portfolio API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Prefix our routes with /api
    app.include_router(router, prefix="/api")

    # Serve static assets from the frontend directory
    if os.path.exists("frontend/assets"):
        app.mount("/assets", StaticFiles(directory="frontend/assets"), name="assets")

    @app.get("/")
    async def read_index():
        return FileResponse("frontend/index.html")

    # Serve files from frontend root (manifest, etc) and fallback to index.html
    @app.get("/{file_name}")
    async def get_root_file(file_name: str):
        file_path = os.path.join("frontend", file_name)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse("frontend/index.html")

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get('PORT', 5000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
