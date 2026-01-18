import subprocess
import tempfile
from pathlib import Path

import numpy as np
import trimesh

from QRGenerator import QRGenerator


class Carver:
    def __init__(
        self,
        box_extents,
        font,
        depth,
        qr_module_size=1.0,
        qr_border=4,
        qr_error_correction=None,
        font_path=None,
    ):
        self.font = font
        self.font_path = font_path
        self.depth = depth
        self.box_extents = box_extents
        self.mesh = None
        self.qr_generator = QRGenerator(
            self.box_extents,
            self.depth,
            module_size=qr_module_size,
            border=qr_border,
            error_correction=qr_error_correction,
        )

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
    
    def carve_qr(self, x, y, url, module_size=None, border=None, side="top"):
        self._ensure_base_mesh(self.box_extents)

        module_boxes = list(
            self.qr_generator.iter_module_boxes(
                x,
                y,
                url,
                module_size=module_size,
                border=border,
                side=side,
            )
        )
        if not module_boxes:
            raise ValueError("QR matrix has no filled modules.")

        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_path = Path(tmpdir)
            base_path = tmp_path / "base.stl"
            result_path = tmp_path / "result.stl"
            scad_path = tmp_path / "boolean.scad"

            self.mesh.export(base_path)

            scad_lines = [
                "difference() {",
                f'  import("{base_path.as_posix()}");',
                "  union() {",
            ]
            depth = self.qr_generator.depth
            for x_min, y_min, z_min, size in module_boxes:
                scad_lines.append(
                    "    translate(["
                    f"{x_min}, {y_min}, {z_min}"
                    "]) cube(["
                    f"{size}, {size}, {depth}"
                    "]);"
                )
            scad_lines.extend(
                [
                    "  }",
                    "}",
                ]
            )

            scad_path.write_text("\n".join(scad_lines), encoding="utf-8")

            subprocess.run(
                ["openscad", "-o", str(result_path), str(scad_path)],
                check=True,
            )

            self.mesh = trimesh.load(result_path, force="mesh")

        return self.mesh

    def fill_in_qr(self, x, y, url, module_size=None, border=None, side="top"):
        return self.qr_generator.build_qr_mesh(
            x,
            y,
            url,
            module_size=module_size,
            border=border,
            side=side,
        )

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
            
            use_statement = ""
            if self.font_path:
                use_statement = f'use <{Path(self.font_path).resolve().as_posix()}>'

            scad_path.write_text(
                "\n".join(
                    [
                        use_statement,
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

    def generate_rounded_base(self, radius):
        """Generates a base box with rounded corners (XY plane) using OpenSCAD."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_path = Path(tmpdir)
            result_path = tmp_path / "base_rounded.stl"
            scad_path = tmp_path / "base_rounded.scad"

            width = self.box_extents[0]
            height = self.box_extents[1]
            thickness = self.box_extents[2]
            
            # OpenSCAD script for rounded box using hull of 4 cylinders
            # Centered at origin
            scad_script = f"""
            w = {width};
            h = {height};
            d = {thickness};
            r = {radius};

            linear_extrude(height=d)
                offset(r=r, $fn=60)
                    square([w-2*r, h-2*r], center=true);
            """
            # Note: linear_extrude in OpenSCAD by default starts at z=0 and goes to z=d. 
            # If we want it centered in Z (which trimesh.creation.box does), we should translate it.
            # trimesh.creation.box is centered at origin [0,0,0].
            # So z range is [-thickness/2, thickness/2].
            # OpenSCAD linear_extrude with center=true centers it in Z.
            
            scad_script = f"""
            w = {width};
            h = {height};
            d = {thickness};
            r = {radius};

            linear_extrude(height=d, center=true)
                offset(r=r, $fn=60)
                    square([w-2*r, h-2*r], center=true);
            """

            scad_path.write_text(scad_script, encoding="utf-8")

            subprocess.run(
                ["openscad", "-o", str(result_path), str(scad_path)],
                check=True,
            )

            mesh = trimesh.load(result_path, force="mesh")
            self.mesh = mesh
            return mesh
