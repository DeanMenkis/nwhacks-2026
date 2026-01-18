from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Literal
import numpy as np
import trimesh
import tempfile
import os
import shutil
from pathlib import Path
from Carver import Carver
import io  # For BytesIO

app = FastAPI()

# Default constants
# To change the font, set the CARD_FONT environment variable or change this default.
DEFAULT_FONT = os.environ.get("CARD_FONT", "DejaVu Sans")
DEFAULT_DEPTH = 0.4
DEFAULT_QR_MODULE_SIZE = 1.2
DEFAULT_QR_BORDER = 2

# Models match the provided JSON structure


class Dimensions(BaseModel):
    width: float
    height: float


class Design(BaseModel):
    filletRadius: float
    thickness: float
    dimensions: Dimensions


class Content(BaseModel):
    name: str
    email: str
    jobTitle: str
    phoneNumber: Optional[str] = ""
    github: Optional[str] = None
    linkedin: Optional[str] = None
    qrUrl: str


class Position(BaseModel):
    x: float
    y: float
    face: Optional[str] = "top"  # "top", "back" (mapped to bottom)


class PositionsMap(BaseModel):
    name: Position
    jobTitle: Position
    phone: Position
    email: Position
    github: Position
    linkedin: Position
    qrCode: Position


class CardRequest(BaseModel):
    metadata: Optional[Dict] = {}
    design: Design
    content: Content
    positions: PositionsMap


@app.post("/generate")
async def generate_card(request: CardRequest):
    try:
        # Extract parameters
        width = request.design.dimensions.width
        height = request.design.dimensions.height
        thickness = request.design.thickness

        # Dimensions array: [width, height, thickness]
        # generator.py uses: BOX_EXTENTS = np.array([84.5, 54.0, 1.6])
        box_extents = np.array([width, height, thickness])

        # Initialize Carver
        carver = Carver(
            box_extents,
            DEFAULT_FONT,
            DEFAULT_DEPTH,
            qr_module_size=DEFAULT_QR_MODULE_SIZE,
            qr_border=DEFAULT_QR_BORDER,
        )

        # Create base mesh
        # Note: box_extents in Carver seemingly expects [x, y, z]
        box_mesh = trimesh.creation.box(extents=box_extents)
        box_mesh.split()
        carver.mesh = box_mesh  # Initialize carver mesh with the box

        # Helper to map face to side
        def get_qr_side_position(face_str: str):
            if face_str.lower() in ["back", "bottom"]:
                return "bottom"
            return "top"

        # Process Text Fields
        # We will iterate through these and collect meshes to carve in one go
        # to prevent mesh degradation from repeated OpenSCAD boolean operations.

        fields_to_process = [
            ("name", request.content.name, request.positions.name),
            ("jobTitle", request.content.jobTitle, request.positions.jobTitle),
            ("email", request.content.email, request.positions.email),
            ("phone", request.content.phoneNumber, request.positions.phone),
        ]

        TEXT_HEIGHT = 4.0

        text_meshes_for_scene = []

        for field_name, text_value, position in fields_to_process:
            if not text_value:
                continue

            # Create the text mesh
            box_mesh = carver.carve_text(
                position.x,
                position.y,
                text=text_value,
                text_height=TEXT_HEIGHT
                )
            
            txt_mesh = carver.fill_in_text(
                position.x,
                position.y,
                text=text_value,
                text_height=TEXT_HEIGHT,
            )

            text_meshes_for_scene.append(txt_mesh)

        # Process QR Code
        qr_pos = request.positions.qrCode
        qr_side = get_qr_side_position(qr_pos.face)

        carver.carve_qr(
            qr_pos.x,
            qr_pos.y,
            url=request.content.qrUrl,
            side=qr_side
        )

        qr_mesh = carver.fill_in_qr(
            qr_pos.x,
            qr_pos.y,
            url=request.content.qrUrl,
            side=qr_side
        )

        # Assemble Scene
        scene = trimesh.Scene()
        scene.add_geometry(carver.mesh, node_name="card_body")

        for i, tm in enumerate(text_meshes_for_scene):
            scene.add_geometry(tm, node_name=f"text_{i}")

        scene.add_geometry(qr_mesh, node_name="qr_code")

        # Export to 3MF in memory
        with tempfile.NamedTemporaryFile(suffix=".3mf", delete=False) as tmp:
            scene.export(tmp.name)
            tmp_path = tmp.name

        # Read file back to stream
        # (StreamingResponse can take a file-like object or iterator)
        # We can just return the file content.

        def iterfile():
            with open(tmp_path, "rb") as f:
                yield from f
            # Cleanup
            os.remove(tmp_path)

        return StreamingResponse(
            iterfile(),
            media_type="model/3mf",
            headers={"Content-Disposition": "attachment; filename=card.3mf"}
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
