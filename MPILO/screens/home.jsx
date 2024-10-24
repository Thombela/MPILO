import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesomeIcon from '../custom/fontAwesomeIcon'
import { regular, solid } from '../iconPaths'
import Header from '../shared/header';
import { uploadFile } from '../functions';
import constants from '../custom/constants';
import { useUserData } from '../data/session';
import { useRoute } from '@react-navigation/native';

export default function Index({navigation}) {
    const navigate = navigation.navigate
    const route = useRoute()
    const {calibrate} = route.params
    const {projects, setProjects} = useUserData()
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [recording, setRecording] = useState(false);
    const cameraRef = useRef(null);
    const [folderModal, setFolderModal] = useState(false)
    const [timer, setTimer] = useState(0)
    const [video, setVideo] = useState({})

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const startRecording = async () => {
      if (cameraRef.current) {
        try {
          setRecording(true);
          const footage = await cameraRef.current.recordAsync();
          setVideo(footage)
        } catch (e) {
        }
      }
    };
    const stopRecording = () => {
        setTimer(0)
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
            setRecording(false);
        }
        setFolderModal(true)
    };
    const uploadVideo = async (folderName) => {
        const data = {
            uri: video.uri,
            name: "video.mp4",
            folderName: folderName
        };
        console.log(data)
        try {
            const response = await uploadFile('/upload', data);
            console.log('Upload successful', response);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };
    const select = (folderName) => {
        console.log(folderName)
        uploadVideo(folderName);
        setFolderModal(false)
    }
    useEffect(() => {
      let interval;
      
      if (recording) {
        interval = setInterval(() => {
          setTimer(prevCount => prevCount + 1);
        }, 1000); // Increment by 1 every second
      }
      else{
        setTimer(0)
      }
      return () => clearInterval(interval);
    }, [recording]);
    if (!permission) {
        return <View />;
    }
    else if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
    else{
        return (
            <View style={styles.container}>
                <Modal  animationType='fade' visible={folderModal} onRequestClose={() => setFolderModal(false)} transparent={true}>
                    <View style={styles.modal}>
                        <View style={styles.modalDialog}>
                            <View style={styles.modalContent}>
                                <Text style={constants.h1}>
                                    Please select the folder this video belongs to
                                </Text>
                                <View style={styles.projects}>
                                    {projects.map((project, index) => (
                                        <TouchableOpacity style={styles.project} key={index} onPress={() => select(project.name)}>
                                            <Image style={styles.projectImage} source={{uri: `file:///Users/ngcoya/Library/CloudStorage/OneDrive-UniversityofCapeTown/Desktop/UCT/BSc%20Eng%20in%20Mechatronics/Final%20Year/2nd%20Semester/EEE4022S/MPILO/images/${project.image}`}} />
                                            <Text style={styles.projectName}>
                                                {project.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.closeButton}>
                                    <TouchableOpacity onPress={() => setCreateModal(false)}>
                                        <FontAwesomeIcon icon={solid.faXmark} size={30} colour='#000' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <CameraView 
                    style={styles.camera}
                    facing={facing}
                    ref={cameraRef}
                    mode="video">
                    <SafeAreaView style={styles.safeArea}>
                        <View style={[styles.timerContainer, (recording? '' : constants.hide)]}>
                            <Text style={[constants.h1, styles.timer]}>
                                {Math.floor(timer/3600) > 9? '':'0'}{Math.floor(timer/3600)}:{Math.floor(timer/60) > 9? '' : '0'}{Math.floor(timer/60)}:{timer%60 > 9? '' : '0'}{timer%60}
                            </Text>
                        </View>
                    </SafeAreaView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <FontAwesomeIcon icon={regular.faCircle} size={100} colour='#ffffff' />
                            {calibrate == false?(
                                <TouchableOpacity style={styles.cameraButton} onPress={recording ? stopRecording : startRecording}>
                                    <FontAwesomeIcon icon={recording ? solid.faSquare : solid.faCircle} size={recording ? 60 : 75} colour={recording ? '#FF3131' : '#ffffff'} />
                                </TouchableOpacity>):(
                                <TouchableOpacity style={styles.cameraButton}>
                                    <FontAwesomeIcon icon={recording ? solid.faSquare : solid.faCircle} size={recording ? 60 : 75} colour={recording ? '#FF3131' : '#ffffff'} />
                                </TouchableOpacity>
                                )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <FontAwesomeIcon icon={solid.faCameraRotate} size={100} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
                <Header navigate={navigate} active={'home'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 10
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cameraButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        paddingRight: 5
    },
    statusText: {
        position: 'absolute',
        top: 30,
        right: 30,
        fontSize: 20,
        color: 'green',
    },
    timerContainer: {
        flex: 1,
        backgroundColor: '#FF3131A6',
        maxHeight: 50,
        width: '60%',
        top: 5,
        borderRadius: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        color: '#fff',
        fontFamily: 'Helvetica'
    },
    modal: {
        flex: 1,
        backgroundColor: '#000000A6'
    },
    modalDialog: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 8,
        maxHeight: '40%',
        overflow: 'scroll'
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    projects: {
        flex: 1
    },
    project: {
        flex: 1,
        width: '100%',
        maxHeight: 80,
        borderColor: '#000000A6',
        borderRadius: 15,
        borderWidth: 2,
        overflow: 'hidden',
        position: 'relative',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 10
        
    },
    projectImage: {
        flex: 1,
        backgroundColor: '#fff',
        height: 80,
        maxWidth: 80,
        aspectRatio: 1,
        marginRight: 40,
    },
    projectName:{
        fontWeight: 'bold',
        fontSize: 18,
        justifyContent: 'center'
    },
});