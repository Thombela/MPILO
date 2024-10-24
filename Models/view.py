import open3d as o3d
import numpy as np

def capture_image(vis):
    image = vis.capture_screen_float_buffer(do_render=True)
    #o3d.io.write_image("shoe/result.png", o3d.geometry.Image((np.asarray(image) * 255).astype(np.uint8)))


mesh_path = 'shoe/shoe.obj'
mesh = o3d.io.read_triangle_mesh(mesh_path)
o3d.visualization.draw_geometries([mesh])