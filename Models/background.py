import cv2 as cv
import os
from rembg import remove
import sys

if(len(sys.argv) >= 2):
    folder = sys.argv[1]
else:
    folder = 'shoe'

model = folder
express_directory = os.getcwd()
python_directory = os.path.abspath(os.path.join(express_directory, '../Models'))
folder = os.path.join(python_directory, folder)

if os.path.exists(folder) and os.path.isdir(folder):
    video_path = os.path.join(folder,'video.mp4')
    video = cv.VideoCapture(video_path)
    total_frames = int(video.get(cv.CAP_PROP_FRAME_COUNT))
    print('total frames: '+str(total_frames))

    for i in range(0,total_frames,10):
        print(i)
        video.set(cv.CAP_PROP_POS_FRAMES, i)
        success, image = video.read()
        image = remove(image)
        output_path = os.path.join(folder, model +str(int(i/10)) + '.png')
        cv.imwrite(output_path, image)