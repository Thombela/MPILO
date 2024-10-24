const express = require('express');
const SftpClient = require('ssh2-sftp-client');
const ftpClient = require('ftp');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const {spawn} = require("child_process");
const { server, username, password, port, mode, webite_server } = require('./constants');
const app = express();
const PORT = 1234;
const multer = require('multer');

const sftp = new SftpClient();
const upload = multer({ dest: 'uploads/' })

// Middleware
app.use(cors());
app.use(express.json());

// FTP server configuration
const sftpConfig = {
    host: server,
    user: username,
    password: password,
    port: port
};
const ftpConfig = {
    host: webite_server,
    user: `${username}@${webite_server}`,
    password: password
};
const localClient = {
    // List directories in the local "Models" directory
    list: async (directoryPath) => {
        const fullPath = path.join(__dirname, `../${directoryPath}`);
        const files = await fs.promises.readdir(fullPath, { withFileTypes: true });

        // Mimic SFTP response, returning an array of file objects
        return files.map(file => ({
            name: file.name,
            type: file.isDirectory() ? 'd' : '-', // 'd' for directory, '-' for file
        }));
    },

    // Get a file from the local file system (mimics SFTP get)
    get: async (remoteFilePath, localFilePath) => {
        const sourcePath = path.join(__dirname, `../${remoteFilePath}`);
        await fs.promises.copyFile(sourcePath, localFilePath); // Copy file locally
    },

    // Mimic SFTP put (upload) method for copying a file to the local file system
    put: async (localFilePath, remoteFilePath) => {
        const destinationPath = path.join(__dirname, `../${remoteFilePath}`);
        
        // Create the directory if it doesn't exist
        const dir = path.dirname(destinationPath);
        await fs.promises.mkdir(dir, { recursive: true });
        
        // Copy the local file to the remote destination (which is still on the local file system)
        await fs.promises.copyFile(localFilePath, destinationPath);
    },

    // Mimic the end method (does nothing for local)
    end: async () => {
        return Promise.resolve();
    }
};
const runTransformScript = ( model, settings) => {
    const pythonScript = path.join(__dirname, '../Models/transform.py');
    const process = spawn('python3', ["-u",pythonScript, model, settings]);
    process.stdout.on('data', (data) => {
        console.log(`Output: ${data.toString()}`);
    });
};
const runCreateScript = ( name) => {
    const pythonScript = path.join(__dirname, '../Models/create.py');
    spawn('python3', ["-u",pythonScript, name]);
};
const runBackgroundScript = (name) => {
    const pythonScript = path.join(__dirname, '../Models/background.py');
    const process = spawn('python3', ["-u",pythonScript, name]);
    process.stdout.on('data', (data) => {
        console.log(`Output: ${data.toString()}`);
    });
}

// Connect to HPC server
const connectToSftp = async () => {
    if(mode == 'local'){
        return localClient
    }
    else if(mode == 'hpc'){
        try {
            await sftp.connect(sftpConfig);
            return sftp;
        } catch (error) {
            throw error;
        }
    }
};
const downloadFile = async (remotePath) => {
    const client = await connectToSftp();
    try {
        await sftp.get(remotePath, localPath);
    } catch (error) {
    }
    await client.end();
};
function uploadFileViaFTP(folder, index) {
    return new Promise((resolve, reject) => {
        const ftp = new ftpClient();

        const fileName = 'result.png';
        const localFilePath = path.join(__dirname, `../Models/${folder}/${fileName}`);
        const remotePath = `public_html/mpilo/${username}/images/${folder}-${fileName}`;

        ftp.on('ready', () => {
            ftp.put(localFilePath, remotePath, (err) => {
                if (err) {
                    ftp.end();
                    console.log('error')
                    console.log(err)
                    return reject(err);
                }
                ftp.end();
                resolve({
                    id: index,
                    name: folder,
                    image: `${folder}-${fileName}`
                });
            });
        });

        ftp.connect(ftpConfig);
    });
}
app.post('/upload', upload.single('file'), async (req, res) => {
    const { name, folderName, type } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    let client;
    try {
        client = await connectToSftp();
        const remotePath = `Models/${folderName}/${name}`;  // You can dynamically set the remote path
        await client.put(file.path, remotePath);
        await fs.promises.unlink(file.path);
        runBackgroundScript(folderName);
        res.status(200).json({ message: 'File uploaded and transferred successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'File upload failed' });
    } finally {
        if (client) {
            await client.end();
        }
    }
});
app.get('/download/:fileName', async (req, res) => {
    const { fileName } = req.params;
    const client = await connectToSftp();

    try {
        const remoteFilePath = `Models/shoe/${fileName}`;
        const localFilePath = `../MPILO/images/${fileName}`; // Where the file will be saved temporarily

        // Download file from SFTP server
        await client.get(remoteFilePath, localFilePath);

        // Send file to client
        res.download(localFilePath, fileName, async (err) => {
            if (err) {
                res.status(500).json({ error: 'File download failed' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'File download failed' });
    } finally {
        if (client) {
            await client.end();
        }
    }
});
app.get('/projects', async (req, res) => {
    let client;
    try {
        client = await connectToSftp();
        const directories = await client.list('Models/');

        const folderNames = directories.filter(item => item.type === 'd' && item.name != '__pycache__' && item.name != 'calibrationImages').map(item => item.name);
        
        const result = await Promise.all(
            folderNames.map((folder, index) => {
                return uploadFileViaFTP(folder, index).catch((error) => {
                    console.log(error)
                    return {
                        id: index,
                        name: folder,
                        image: null,
                        error: 'Upload failed'
                    };
                });
            })
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project folders' });
    } finally {
        if (client) {
            await client.end();
        }
    }
});
app.post('/transform', async(req, res) => {
    const { model, settings } = req.body;

    let client;
    try {
        await runTransformScript(model, JSON.stringify(settings));
        const uploadResult = await uploadFileViaFTP(model, 1);
        res.json({
          success: true,
          message: 'Transformation complete and file uploaded successfully!',
          uploadResult
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process transformation' });
    } finally {
        if (client) {
            await client.end(); // Ensure the SFTP connection is closed
        }
    }
})
app.post('/create', async(req, res) => {
    const { name } = req.body;

    let client;
    try {
        client = await connectToSftp();
        await runCreateScript(name)
        res.json({status: 'done'})
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to process transformation' });
    } finally {
        if (client) {
            await client.end();
        }
    }
})
app.listen(PORT, () => {});