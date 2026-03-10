import os
import uvicorn

if __name__ == "__main__":
    # Point uvicorn to the new organized app structure
    port = int(os.environ.get('PORT', 5000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
