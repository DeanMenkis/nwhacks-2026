import subprocess
import tempfile
from pathlib import Path

import numpy as np
import trimesh

BOX_EXTENTS = np.array([84.5, 54.0, 1.6])
TEXT_CONTENT = "FUCK ME IN THE ASS"
TEXT_HEIGHT = 8.0
TEXT_MARGIN = 8.0
TEXT_DEPTH = 1.5
TEXT_FONT = "DejaVu Sans"
OUTPUT_3MF = "output.3mf"


def boolean_difference_openscad(
    box_extents,
    text,
    text_height,
    text_depth,
    text_margin,
    text_font,
):
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        result_path = tmp_path / "result.stl"
        scad_path = tmp_path / "boolean.scad"

        top_z = box_extents[2] / 2.0
        text_x = -box_extents[0] / 2.0 + text_margin
        text_y = 0.0
        text_z = top_z - text_depth

        scad_path.write_text(
            "\n".join(
                [
                    "difference() {",
                    f"  cube([{box_extents[0]}, {box_extents[1]}, {box_extents[2]}], center=true);",
                    "  translate(["
                    f"{text_x}, {text_y}, {text_z}"
                    "])",
                    "    linear_extrude(height="
                    f"{text_depth}"
                    ")",
                    "      text("
                    f"\"{text}\", size={text_height}, font=\"{text_font}\", halign=\"left\", valign=\"center\""
                    ");",
                    "}",
                ]
            ),
            encoding="utf-8",
        )

        subprocess.run(
            ["openscad", "-o", str(result_path), str(scad_path)],
            check=True,
        )

        return trimesh.load(result_path, force="mesh")

mesh = trimesh.creation.box(extents=BOX_EXTENTS)
mesh.split()

try:
    mesh = boolean_difference_openscad(
        box_extents=BOX_EXTENTS,
        text=TEXT_CONTENT,
        text_height=TEXT_HEIGHT,
        text_depth=TEXT_DEPTH,
        text_margin=TEXT_MARGIN,
        text_font=TEXT_FONT,
    )
    scene = trimesh.Scene(mesh)
except FileNotFoundError as exc:
    raise RuntimeError("OpenSCAD not found in PATH.") from exc
# scene.show()

scene.export(OUTPUT_3MF)
