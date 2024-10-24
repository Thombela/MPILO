import open3d as o3d
import numpy as np
import os
import sys
import json

def capture_image(vis, folder):
    image = vis.capture_screen_float_buffer(do_render=True)
    o3d.io.write_image(("../Models/" + folder + "/result.png"), o3d.geometry.Image((np.asarray(image) * 255).astype(np.uint8)))


if(len(sys.argv) >= 3):
    folder = sys.argv[1]
    settings = json.loads(sys.argv[2])
else:
    folder = 'shoe'
    settings = {
        'hori': 1,
        'vert': 1,
        'zoom': 1
    }

obj = folder + '.obj'
current_directory = os.getcwd()
file_path = os.path.abspath(os.path.join(current_directory, '../Models', folder))

mesh_path = ('../Models/' + folder + '/' + obj)
mesh = o3d.io.read_triangle_mesh(mesh_path, True)
#mesh.compute_vertex_normals()

vis = o3d.visualization.Visualizer()
vis.create_window(visible=False)
vis.add_geometry(mesh)

view_control = vis.get_view_control()
view_control.rotate(20 * settings['hori'], 0)
view_control.rotate(0, -20 * settings['vert'])
view_control.scale(1 + settings['zoom'])

vis.poll_events()
vis.update_renderer()

capture_image(vis, folder)

vis.destroy_window()