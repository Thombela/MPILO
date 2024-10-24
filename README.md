# 🎉 Welcome to MPILO! 🎉

## 🌟 Introduction

Welcome to the **MPILO** project! This repository powers a cutting-edge mobile app that integrates **3D visualization** and **pose estimation** for real-time object interaction. Using **Three.js**, **Expo**, and **Python**, this app allows users to view and manipulate 3D models right on their smartphones!

---

## 🔧 Requirements

Before you begin, make sure you have the following installed:

- 🔥 **Node.js**
- 🚀 **Expo CLI**
- 🐍 **Python 3.11+** (with Miniconda)
- 🌐 **NGROK**

---

## 🐍 Setting Up Python Environment

To create and activate your Python environment on the server, run the following commands:

```bash
conda create -n MPILO
conda activate MPILO
```

---

## 📦 Installing Python Libraries

Once your Python environment is ready, install the required libraries with these commands:

```bash
pip install opencv
pip install open3d
pip install rembg
```

---

## 📂 Installing Node.js Dependencies

Navigate into the **MPILO** and **MPILO_Backend** folders, and run this command in each folder:

```bash
npm i
```

---

## 📂 Setting up constants.js

Navigate into the **MPILO_Backend** folders, and add a file called `constants.js` and add the following, server details are based off your own hpc details. If you want to render on your own laptop set mode to `local`:
```
const port = 
const server = '' 
const username = '' 
const password = '' 
const mode = 'hpc'
const webite_server = ''

module.exports = { port, server, username, password, mode, webite_server };
```
---

## 🚀 Starting the Application

Follow these steps to start the MPILO app:

1. Open **two terminals** inside the **MPILO - Backend** folder:
   
   - In the first terminal, start the backend:
     ```bash
     nodemon server.js
     ```

   - In the second terminal, expose your local server using NGROK:
     ```bash
     ngrok http 1234
     ```

2. In the **MPILO** folder, start the Expo app:
   ```bash
   npx expo start
   ```

3. If you're having trouble connecting to the Expo app, use the tunnel mode:
   ```bash
   npx expo start --tunnel
   ```

---

## 🗂️ Explanation of the "Models" Folder

The **Models** folder contains crucial Python scripts that manage the backend processes for the app:

- `background.py`: Removes the background from images.
- `calibrate.py`: Creates a calibration matrix for camera settings.
- `create.py`: Handles the creation of new directories.
- `pose.py`: Calculates pose estimation using chessboard pattern detection.
- `stereo.py`: Generates a multi-view stereo (MVS) reconstruction.
- `transform.py`: Applies transformations (e.g., rotation) to 3D models.

All files, except for `view.py`, are essential for backend functionality in **MPILO - Backend**.

---

## 🖼️ Process for 3D Visualization

To visualize your 3D objects, follow these steps:

1. Create a new folder in **MPILO**.
2. Record an object from the main page and select the project folder.
3. The necessary files will be created on the Models server.
4. Import the files into a 3D reconstruction software to generate an `.obj` file.
5. Save the `.obj` file in the respective project folder.
6. Head to the **Projects** page and select the project you want to view in 3D!

---

✨ Enjoy using **MPILO** and experience seamless 3D visualization at your fingertips! If you have any questions, feel free to reach out. Let's make something awesome together! 🎨🚀
