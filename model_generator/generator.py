from Carver import Carver

import numpy as np
import trimesh

from QRGenerator import QRGenerator


BOX_EXTENTS = np.array([84.5, 54.0, 1.6])
TEXT_CONTENT = "Stop it daddy <3"
TEXT_HEIGHT = 4.0
TEXT_MARGIN = 4.0
TEXT_DEPTH = 0.4
TEXT_FONT = "DejaVu Sans"
QR_URL = "https://www.linkedin.com/in/ilia-moroz-9b805a257/"
QR_MODULE_SIZE = 1.2
QR_BORDER = 2
OUTPUT_3MF = "output.3mf"

carver = Carver(
    BOX_EXTENTS,
    TEXT_FONT,
    TEXT_DEPTH,
    qr_module_size=QR_MODULE_SIZE,
    qr_border=QR_BORDER,
)

# box_mesh = trimesh.creation.box(extents=BOX_EXTENTS)
# box_mesh.split()
# Use rounded base with 3mm radius
box_mesh = carver.generate_rounded_base(3.0)

try:
    # Text 1
    # Standard mesh for subtraction
    text_mesh_1_sub = carver.fill_in_text(
        -30,
        20,
        text=TEXT_CONTENT,
        text_height=TEXT_HEIGHT,
    )
    # Raised mesh for scene
    text_mesh_1_raised = carver.generate_raised_text_mesh(
        -30,
        20,
        text=TEXT_CONTENT,
        text_height=TEXT_HEIGHT,
        extra_height=0.4
    )

    # Text 2
    # Standard mesh for subtraction
    text_mesh_2_sub = carver.fill_in_text(
        -30,
        -10,
        text="PIZDA",
        text_height=TEXT_HEIGHT,
    )
    # Raised mesh for scene
    text_mesh_2_raised = carver.generate_raised_text_mesh(
        -30,
        -10,
        text="PIZDA",
        text_height=TEXT_HEIGHT,
        extra_height=0.4
    )
    
    # Subtract text meshes
    box_mesh = carver.apply_difference([text_mesh_1_sub, text_mesh_2_sub])

    # QR Code
    qr_cutout = carver.generate_qr_cutout_mesh(
        0,
        0,
        url=QR_URL,
        side="bottom"
    )
    # Subtract qr cutout (make sure to include it in difference if not already done, or do another difference)
    # Since apply_difference acts on self.mesh, we can call it again
    box_mesh = carver.apply_difference([qr_cutout])

    qr_mesh = carver.fill_in_qr(
        0,
        0,
        url=QR_URL,
        side = "bottom"
    )

    scene = trimesh.Scene()

    scene.add_geometry(box_mesh, node_name="box")
    scene.add_geometry(text_mesh_1_raised, node_name="text")
    scene.add_geometry(text_mesh_2_raised, node_name="text2")
    scene.add_geometry(qr_mesh, node_name="qr")


except FileNotFoundError as exc:
    raise RuntimeError("OpenSCAD not found in PATH.") from exc
scene.show()

# scene.export(OUTPUT_3MF)
