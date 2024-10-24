import glob
import cv2 as cv
import os
import numpy as np
import csv

def draw(img, corners, imgpts):
    def tupleInts(arr):
        return tuple(int(x) for x in arr)

    corner = tupleInts(corners[0].ravel())
    img = cv.line(img, corner, tupleInts(imgpts[0].ravel()), (255, 0, 0), 5)
    img = cv.line(img, corner, tupleInts(imgpts[1].ravel()), (0, 255, 0), 5)
    img = cv.line(img, corner, tupleInts(imgpts[2].ravel()), (0, 0, 255), 5)
    return img

def save_results_to_csv(results, csv_file='pose_estimations.csv'):
    """Save results to a CSV file."""
    with open(csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['file_name', 'rvec_x', 'rvec_y', 'rvec_z', 
                         'tvec_x', 'tvec_y', 'tvec_z', 'distance_cm'])
        for row in results:
            writer.writerow(row)

def calculate_distance_cm(tvec):
    """Calculate the Euclidean distance from the camera to the checkerboard in centimeters."""
    return np.linalg.norm(tvec)

def poseEstimation():
    root = os.getcwd()
    calibration = os.path.join(root, 'calibration.npz')
    data = np.load(calibration)

    camMatrix = data["camMatrix"]
    distCoeff = data["distCoeff"]

    calibrationDir = os.path.join(root, 'pose')
    imgPathList = glob.glob(os.path.join(calibrationDir, '*.jpg'))

    nRows, nCols = 8, 6
    square_size = 2.5  # Each square side is 2.5 cm
    termCriteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 30, 0.001)

    # Generate world points (object points) in centimeters
    worldPtsCur = np.zeros((nRows * nCols, 3), np.float32)
    worldPtsCur[:, :2] = np.mgrid[0:nRows, 0:nCols].T.reshape(-1, 2) * square_size

    # Axis for 3D visualization (optional)
    axis = np.float32([[3, 0, 0], [0, 3, 0], [0, 0, -3]])

    results = []  # Store results for saving to CSV

    for curImgPath in imgPathList:
        imgBGR = cv.imread(curImgPath)
        imgGray = cv.cvtColor(imgBGR, cv.COLOR_BGR2GRAY)
        cornersFound, cornersOrg = cv.findChessboardCorners(imgGray, (nRows, nCols), None)

        if cornersFound:
            cornersRefined = cv.cornerSubPix(imgGray, cornersOrg, (11, 11), (-1, -1), termCriteria)
            _, rvecs, tvecs = cv.solvePnP(worldPtsCur, cornersRefined, camMatrix, distCoeff)
            imgpts, _ = cv.projectPoints(axis, rvecs, tvecs, camMatrix, distCoeff)
            imgBGR = draw(imgBGR, cornersRefined, imgpts)

            # Calculate distance in centimeters
            distance_cm = calculate_distance_cm(tvecs)

            # Store the result with the image file name
            results.append([os.path.basename(curImgPath), 
                            rvecs[0][0], rvecs[1][0], rvecs[2][0], 
                            tvecs[0][0], tvecs[1][0], tvecs[2][0], 
                            distance_cm])

        # Display the image with the drawn axis (optional)
        cv.imshow('Chessboard', imgBGR)
        cv.waitKey(3000)

    # Save all results to a CSV file
    save_results_to_csv(results)

if __name__ == '__main__':
    poseEstimation()
