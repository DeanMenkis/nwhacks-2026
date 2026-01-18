import subprocess
import tempfile
from pathlib import Path

import numpy as np
import trimesh


class Carver:
    def __init__(self, box_extents, font, depth):
        self.font = font
        self.depth = depth
        self.box_extents = box_extents
        self.mesh = None

    def _ensure_base_mesh(self, box_extents):
        if self.box_extents is None:
            self.box_extents = np.array(box_extents, dtype=float)
        elif not np.allclose(self.box_extents, box_extents):
            raise ValueError(
                "box_extents must stay consistent across carvings")

        if self.mesh is None:
            self.mesh = trimesh.creation.box(extents=self.box_extents)
            self.mesh.split()

    def _difference_openscad(self, base_mesh, subtract_mesh):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_path = Path(tmpdir)
            base_path = tmp_path / "base.stl"
            subtract_path = tmp_path / "subtract.stl"
            result_path = tmp_path / "result.stl"
            scad_path = tmp_path / "boolean.scad"

            base_mesh.export(base_path)
            subtract_mesh.export(subtract_path)

            scad_path.write_text(
                "\n".join(
                    [
                        "difference() {",
                        f'  import("{base_path.as_posix()}");',
                        f'  import("{subtract_path.as_posix()}");',
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

    def carve_text(
        self,
        x,
        y,
        text,
        text_height,
        return_text=False,
    ):
        self._ensure_base_mesh(self.box_extents)
        text_mesh = self.fill_in_text(
            x,
            y,
            text=text,
            text_height=text_height
        )
        self.mesh = self._difference_openscad(self.mesh, text_mesh)
        if return_text:
            return self.mesh, text_mesh
        return self.mesh

    def fill_in_text(
        self,
        x,
        y,
        text,
        text_height,        
    ):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_path = Path(tmpdir)
            result_path = tmp_path / "text.stl"
            scad_path = tmp_path / "text.scad"

            top_z = self.box_extents[2] / 2.0
            
            text_x = x
            text_y = y
            text_z = top_z - self.depth

            scad_path.write_text(
                "\n".join(
                    [
                        "translate(["
                        f"{text_x}, {text_y}, {text_z}"
                        "])",
                        "  linear_extrude(height="
                        f"{self.depth}"
                        ")",
                        "    text("
                        f"\"{text}\", size={text_height}, font=\"{self.font}\", halign=\"left\", valign=\"center\""
                        ");",
                    ]
                ),
                encoding="utf-8",
            )

            subprocess.run(
                ["openscad", "-o", str(result_path), str(scad_path)],
                check=True,
            )

            return trimesh.load(result_path, force="mesh")
