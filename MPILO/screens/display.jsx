import React, { useState, useEffect, useRef } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Header from '../shared/header';
import { useRoute } from '@react-navigation/native'
import FontAwesomeIcon from '../custom/fontAwesomeIcon';
import { solid } from '../iconPaths';
import { useUserData } from '../data/session';
import { PostData } from '../functions';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';
import {
  AmbientLight,
  Fog,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  TextureLoader
} from 'three';
import {GLView} from 'expo-gl'

export default function Display({navigation}) {
    const navigate = navigation.navigate
    const route = useRoute()
    const {objectId} = route.params
    const {projects, setProjects, userData} = useUserData()
    const [project, setProject] = useState({...projects.find(project => project.id == objectId), count:0})
    const [settings, setSettings] = useState({
        hori: 0,
        vert: 0,
        zoom: 0,
    })
    const transform = (type, sum) => {
        const updatedSettings = {...settings, [type]: settings[type]+sum}
        const data = {
            model: project.name,
            settings: updatedSettings
        }
        PostData('/transform', data)
        setSettings(updatedSettings)
        setProject({...project, count: project.count+1})
    }
    if(project && userData.renderType == 'perspective'){
        return (
          <View style={styles.container}>
              <View style={styles.display}>
                  <View style={styles.control}>
                      <View style={styles.controlTop}>
                        <TouchableOpacity onPress={() => transform('vert', 1)}>
                          <FontAwesomeIcon size={50} icon={solid.faSquareCaretUp} colour='#4d4d4d' />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.controlCenter}>
                        <TouchableOpacity onPress={() => transform('hori', -1)}>
                          <FontAwesomeIcon size={50} icon={solid.faSquareCaretLeft} colour='#4d4d4d' />
                        </TouchableOpacity>
                          <TouchableOpacity onPress={() => transform('hori', 1)}>
                          <FontAwesomeIcon size={50} icon={solid.faSquareCaretRight} colour='#4d4d4d' />
                          </TouchableOpacity>
                      </View>
                      <View style={styles.controlBottom}>
                        <TouchableOpacity onPress={() => transform('zoom', 1)}>
                          <FontAwesomeIcon size={50} icon={solid.faSquareMinus} colour='#4d4d4d' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => transform('vert', -1)}>
                          <FontAwesomeIcon size={50} icon={solid.faSquareCaretDown} colour='#4d4d4d' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => transform('zoom', -1)}>
                          <FontAwesomeIcon size={50} icon={solid.faSquarePlus} colour='#4d4d4d' />
                        </TouchableOpacity>
                      </View>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} resizeMode='contain' source={{uri: `https://ngcoyaindustries.co.za/mpilo/ngcmpi002/images/${project.image}?time=${new Date()}`}} />
                  </View>
              </View>
              <Header navigate={navigate} active={'projects'} />
          </View>
        )
    }
    else{
      const glRef = useRef(null);
      const cameraRef = useRef();
      const rendererRef = useRef();
      const sceneRef = useRef();
      let objectRef = useRef();

      const onContextCreate = async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 668096;
    
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(0x668096);
        rendererRef.current = renderer;
    
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 10);
        cameraRef.current = camera;
    
        const scene = new Scene();
        //scene.fog = new Fog(sceneColor, 1, 10000);
        sceneRef.current = scene;
    
        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);
    
        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);
    
        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight)

        const loader = new GLTFLoader();

        loader.load('https://ngcoyaindustries.co.za/mpilo/ngcmpi002/objects/shoe.glb', function (object) {
          //console.log('object loaded')
          //object.scale.set(0.5, 0.5, 0.5);
          scene.add(object.scene);
          //objectRef.current = object; // Store the object reference for later use
          //camera.lookAt(object.position);
          //object.rotateZ(Math.PI * 10 / 180);
          renderScene(); // Initial render
          //gl.endFrameEXP();
        },
        function (error) {
          console.log(error);
        });
    
        const animate = () => {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                renderScene();
            }
            gl.endFrameEXP(); // Make sure to end the frame
            requestAnimationFrame(animate); // Keep the loop going
        };
    
        requestAnimationFrame(animate); // Start the animation loop
      };
      const transform = (type) => {
        if(type == 'zoom in'){
          cameraRef.current.position.z -= 1
        }
        else if(type == 'zoom out'){
          cameraRef.current.position.z += 1
        }
        else if (type === 'rotate left') {
          objectRef.current.rotation.y += 0.5;
        }
        else if (type === 'rotate up') {
            objectRef.current.rotation.x += 0.5;
        }
        renderScene();
      }

      const renderScene = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }

      return(
        <View style={styles.container}>
          <View style={styles.display}>
            <View style={styles.control}>
                <View style={styles.controlTop}>
                  <TouchableOpacity onPress={() => transform('rotate up')}>
                    <FontAwesomeIcon size={50} icon={solid.faSquareCaretUp} colour='#4d4d4d' />
                  </TouchableOpacity>
                </View>
                <View style={styles.controlCenter}>
                  <TouchableOpacity onPress={() => transform('rotate left')}>
                    <FontAwesomeIcon size={50} icon={solid.faSquareCaretLeft} colour='#4d4d4d' />
                  </TouchableOpacity>
                    <TouchableOpacity onPress={() => transform('right')}>
                    <FontAwesomeIcon size={50} icon={solid.faSquareCaretRight} colour='#4d4d4d' />
                    </TouchableOpacity>
                </View>
                <View style={styles.controlBottom}>
                  <TouchableOpacity onPress={() => transform('zoom out')}>
                    <FontAwesomeIcon size={50} icon={solid.faSquareMinus} colour='#4d4d4d' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => transform('vert', -1)}>
                    <FontAwesomeIcon size={50} icon={solid.faSquareCaretDown} colour='#4d4d4d' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => transform('zoom in')}>
                    <FontAwesomeIcon size={50} icon={solid.faSquarePlus} colour='#4d4d4d' />
                  </TouchableOpacity>
                </View>
            </View>
            <GLView
              style={{ flex: 1 }}
              onContextCreate={onContextCreate}
              ref={glRef}
            />
          </View>
          <Header navigate={navigate} active={'projects'} />
        </View>
      )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    display: {
        flex: 1,
        marginTop: 40
    },
    imageContainer: {
        flex: 1,
        padding: 40,
        backgroundColor: 'transparent',
        objectFit: 'contain'
    },
    image: {
        flex: 1
    },
    control: {
        flex: 1,
        width: '100%',
        position: 'absolute',
        height: '100%',
        justifyContent: 'space-between',
        zIndex: 2
    },
    controlTop: {
        alignItems: 'center'
    },
    controlCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    controlBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    flex: {
      flex: 1,
    },
    snapshot: {
      height: 100,
      margin: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'black',
      backgroundColor: '#248e80',
      position: 'absolute',
      left: 0,
      bottom: 0,
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 0 },
    },
    snapshotButton: {
      margin: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: 'white',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'black',
      borderRadius: 5,
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
})