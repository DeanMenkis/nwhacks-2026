import subprocess
import tempfile
from pathlib import Path
from Carver import Carver

import numpy as np
import trimesh

BOX_EXTENTS = np.array([84.5, 54.0, 1.6])
TEXT_CONTENT = "Stop it daddy <3"
TEXT_HEIGHT = 4.0
TEXT_MARGIN = 4.0
TEXT_DEPTH = 0.4
TEXT_FONT = "DejaVu Sans"
OUTPUT_3MF = "output.3mf"

carver = Carver(BOX_EXTENTS, TEXT_FONT, TEXT_DEPTH)

box_mesh = trimesh.creation.box(extents=BOX_EXTENTS)
box_mesh.split()

try:
    box_mesh = carver.carve_text(
        -30, 
        20,
        box_extents=BOX_EXTENTS,
        text=TEXT_CONTENT,
        text_height=TEXT_HEIGHT,
    )
    
    box_mesh = carver.carve_text(
        -30, 
        -10,
        box_extents=BOX_EXTENTS,
        text="PIZDA",
        text_height=TEXT_HEIGHT,
    )

    # text_mesh = carver.text_mesh_openscad(
    #     box_extents=BOX_EXTENTS,
    #     text=TEXT_CONTENT,
    #     text_height=TEXT_HEIGHT,
    #     text_depth=TEXT_DEPTH,
    #     text_margin=TEXT_MARGIN,
    #     text_font=TEXT_FONT
    # )

    scene = trimesh.Scene()

    scene.add_geometry(box_mesh, node_name="box")


except FileNotFoundError as exc:
    raise RuntimeError("OpenSCAD not found in PATH.") from exc
scene.show()

# scene.export(OUTPUT_3MF)
