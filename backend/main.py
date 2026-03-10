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

    # Serve static assets from the root directories
    if os.path.exists("assets"):
        app.mount("/assets", StaticFiles(directory="assets"), name="assets")
    if os.path.exists("css"):
        app.mount("/css", StaticFiles(directory="css"), name="css")
    if os.path.exists("js"):
        app.mount("/js", StaticFiles(directory="js"), name="js")

    @app.get("/")
    async def read_index():
        return FileResponse("index.html")

    # Serve files from root and fallback to index.html
    @app.get("/{file_name}")
    async def get_root_file(file_name: str):
        # Security: only serve specific allowed extensions or files from root
        allowed_extensions = {".ico", ".png", ".jpg", ".json", ".txt", ".webmanifest"}
        file_path = file_name
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # Check if extension is allowed and file is not sensitive
            _, ext = os.path.splitext(file_name)
            if ext.lower() in allowed_extensions and not file_name.startswith("."):
                return FileResponse(file_path)
        
        return FileResponse("index.html")

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get('PORT', 5000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
