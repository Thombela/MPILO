import os
import sys
import shutil

if(len(sys.argv) >= 2):
    folder = sys.argv[1]
else:
    folder = "example_directory"

express_directory = os.getcwd()
python_directory = os.path.abspath(os.path.join(express_directory, '../Models'))
new_directory = os.path.join(python_directory, folder)
if not os.path.exists(new_directory):
    os.makedirs(new_directory)
    image_source = os.path.join(python_directory, 'result.png')
    image_path = os.path.join(new_directory, 'result.png')
    shutil.copy(image_source, image_path)