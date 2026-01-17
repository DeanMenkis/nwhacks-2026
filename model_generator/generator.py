from pathlib import Path

import numpy as np
import trimesh


def load_demo_mesh() -> trimesh.Trimesh:
    demo_dir = Path(__file__).resolve().parent
    candidates = [
        demo_dir / "models" / "featuretype.STL",
        demo_dir.parent / "models" / "featuretype.STL",
    ]
    for path in candidates:
        if path.exists():
            return trimesh.load_mesh(path)

    # Fallback to a procedural mesh so the demo still runs without external files.
    return trimesh.creation.icosphere(radius=1.0)


mesh = load_demo_mesh()
convex_volume = mesh.convex_hull.volume
volume_ratio = mesh.volume / convex_volume if convex_volume else np.nan
mesh.vertices -= mesh.center_mass
mesh.split()
mesh.show()
