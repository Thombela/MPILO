import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
import os
from rembg import remove

root = os.getcwd()
calibration = os.path.join(root, 'calibration.npz')
data = np.load(calibration)

camMatrix = data["camMatrix"]
distCoeff = data["distCoeff"]

folder = "shoe"
video_path = os.path.join(folder,'video.mov')
video = cv.VideoCapture(video_path)
total_frames = int(video.get(cv.CAP_PROP_FRAME_COUNT))
print(total_frames)


video.set(cv.CAP_PROP_POS_FRAMES, 0)
success, true_left = video.read()
video.set(cv.CAP_PROP_POS_FRAMES, 120)
success, true_right = video.read()

img_left_color = true_left[600:1800, 0:1200]
img_right_color = true_right[600:1800, 0:1200]

img_left_color_rembg = remove(img_left_color)
img_right_color_rembg = remove(img_right_color)

img_left_bw = cv.blur(cv.cvtColor(img_left_color_rembg, cv.COLOR_RGB2GRAY),(5,5))
img_right_bw = cv.blur(cv.cvtColor(img_right_color_rembg, cv.COLOR_RGB2GRAY),(5,5))


def write_ply(fn, verts, colors):
    ply_header = '''ply
    format ascii 1.0
    element vertex %(vert_num)d
    property float x
    property float y
    property float z
    property uchar red
    property uchar green
    property uchar blue
    end_header
    '''
    out_colors = colors.copy()
    verts = verts.reshape(-1, 3)
    verts = np.hstack([verts, out_colors])
    with open(fn, 'wb') as f:
        f.write((ply_header % dict(vert_num=len(verts))).encode('utf-8'))
        np.savetxt(f, verts, fmt='%f %f %f %d %d %d ')

stereo = cv.StereoBM_create(numDisparities=128, blockSize=7)
disparity = stereo.compute(img_left_bw,img_right_bw)

img = disparity.copy()

def poseEstimation(image):

    nRows = 8
    nCols = 6
    termCriteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 30, 0.001)
    worldPtsCur = np.zeros((nRows*nCols,3), np.float32)
    worldPtsCur[:,:2] = np.mgrid[0:nRows,0:nCols].T.reshape(-1,2)

    
    imgGray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    cornersFound, cornersOrg = cv.findChessboardCorners(imgGray, (nRows, nCols), None)
    if cornersFound == True:
        cornersRefined = cv.cornerSubPix(imgGray, cornersOrg, (11,11),(-1,-1), termCriteria)
        _, rvecs, tvecs = cv.solvePnP(worldPtsCur, cornersRefined, camMatrix, distCoeff)
        return rvecs, tvecs
    return 0,0

def getCalibrationMatrix(image):
    rvecs, tvecs = poseEstimation(image)
    extrinsic_matrix = np.hstack((rvecs, tvecs))
    
    return extrinsic_matrix


extrinsic_matrix1 = getCalibrationMatrix(true_left)
extrinsic_matrix2 = getCalibrationMatrix(true_right)

Tmat = np.array([0.54, 0., 0.])

rev_proj_matrix = np.zeros((4,4))

cv.stereoRectify(cameraMatrix1 = camMatrix,cameraMatrix2 = camMatrix, \
                  distCoeffs1 = distCoeff, distCoeffs2 = distCoeff, \
                  imageSize = img_left_color.shape[:2], \
                  R = np.identity(3), T = Tmat, \
                  R1 = None, R2 = None, \
                  P1 =  None, P2 =  None, Q = rev_proj_matrix);

points = cv.reprojectImageTo3D(img, rev_proj_matrix)

#reflect on x axis
reflect_matrix = np.identity(3)
reflect_matrix[0] *= -1
points = np.matmul(points,reflect_matrix)

#extract colors from image
colors = cv.cvtColor(img_left_color, cv.COLOR_BGR2RGB)

#filter by min disparity
mask = img > img.min()
out_points = points[mask]
out_colors = colors[mask]

#filter by dimension
idx = np.fabs(out_points[:,0]) < 4.5
out_points = out_points[idx]
out_colors = out_colors.reshape(-1, 3)
out_colors = out_colors[idx]

write_ply(folder+'/'+folder+'1.ply', out_points, out_colors)
print('%s saved' % 'out.ply')