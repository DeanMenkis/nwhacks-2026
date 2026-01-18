import numpy as np
import trimesh

try:
    import qrcode
except ModuleNotFoundError as exc:
    raise RuntimeError(
        "Missing dependency: qrcode. Install with `pip install qrcode[pil]`."
    ) from exc


class QRGenerator:
    def __init__(
        self,
        box_extents,
        depth,
        module_size=1.0,
        border=4,
        error_correction=None,
    ):
        self.box_extents = np.array(box_extents, dtype=float)
        self.depth = float(depth)
        self.module_size = float(module_size)
        self.border = int(border)
        self.error_correction = (
            error_correction or qrcode.constants.ERROR_CORRECT_M
        )
        if self.module_size <= 0:
            raise ValueError("module_size must be positive.")
        if self.depth <= 0:
            raise ValueError("depth must be positive.")

    def qr_matrix(self, url, border=None):
        return self._qr_matrix(url, border=border)

    def iter_module_boxes(self, x, y, url, module_size=None, border=None, side="top"):
        if module_size is None:
            module_size = self.module_size
        if module_size <= 0:
            raise ValueError("module_size must be positive.")
        if side not in {"top", "bottom"}:
            raise ValueError("side must be 'top' or 'bottom'.")

        matrix = self._qr_matrix(url, border=border)
        size = len(matrix)
        total_size = size * module_size
        min_x = x - (total_size / 2.0)
        max_y = y + (total_size / 2.0)
        top_z = self.box_extents[2] / 2.0
        if side == "top":
            z_min = top_z - self.depth
        else:
            z_min = -top_z

        for row in range(size):
            for col in range(size):
                if not matrix[row][col]:
                    continue
                yield (
                    min_x + (col * module_size),
                    max_y - ((row + 1.0) * module_size),
                    z_min,
                    module_size,
                )

    def _qr_matrix(self, url, border=None):
        if border is None:
            border = self.border
        qr = qrcode.QRCode(
            version=None,
            error_correction=self.error_correction,
            box_size=1,
            border=0,
        )
        qr.add_data(url)
        qr.make(fit=True)
        matrix = qr.get_matrix()
        if not border:
            return matrix

        size = len(matrix)
        padded_size = size + (2 * border)
        padding_row = [False] * padded_size
        padded = [padding_row[:] for _ in range(border)]
        for row in matrix:
            padded.append(
                ([False] * border) + list(row) + ([False] * border)
            )
        padded.extend([padding_row[:] for _ in range(border)])
        return padded

    def build_qr_mesh(self, x, y, url, module_size=None, border=None, side="top"):
        if module_size is None:
            module_size = self.module_size
        if module_size <= 0:
            raise ValueError("module_size must be positive.")
        if side not in {"top", "bottom"}:
            raise ValueError("side must be 'top' or 'bottom'.")

        matrix = self._qr_matrix(url, border=border)
        size = len(matrix)
        total_size = size * module_size
        top_z = self.box_extents[2] / 2.0
        min_x = x - (total_size / 2.0)
        max_y = y + (total_size / 2.0)
        if side == "top":
            z_center = top_z - (self.depth / 2.0)
        else:
            z_center = -top_z + (self.depth / 2.0)

        box_extents = np.array([module_size, module_size, self.depth], dtype=float)
        meshes = []

        for row in range(size):
            for col in range(size):
                if not matrix[row][col]:
                    continue
                center = np.array(
                    [
                        min_x + ((col + 0.5) * module_size),
                        max_y - ((row + 0.5) * module_size),
                        z_center,
                    ],
                    dtype=float,
                )
                module = trimesh.creation.box(extents=box_extents)
                module.apply_translation(center)
                meshes.append(module)

        if not meshes:
            raise ValueError("QR matrix has no filled modules.")

        if len(meshes) == 1:
            qr_mesh = meshes[0]
        else:
            qr_mesh = trimesh.util.concatenate(meshes)
        qr_mesh.split()
        return qr_mesh
