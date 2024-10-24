import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Header from '../shared/header';
import { GetData } from '../functions';
import { BASE_URL } from '../constants';
import FontAwesomeIcon from '../custom/fontAwesomeIcon';
import { solid } from '../iconPaths';
import { useUserData } from '../data/session';

export default function Projects({navigation}) {
    const navigate = navigation.navigate
    const {projects, setProjects} = useUserData()

    useEffect(() => {
        GetData('/projects').then((res) => {
            setProjects(res)
        })
    },[])
    if(projects){
        return (
          <View style={styles.container}>
              <ScrollView style={styles.projects}>
                  {projects.map((project, index) => (
                      <TouchableOpacity style={styles.project} key={index} onPress={() => navigate('display', {objectId: project.id})}>
                          <Image style={styles.projectImage} source={{uri: `https://ngcoyaindustries.co.za/mpilo/ngcmpi002/images/${project.image}`}} />
                          <Text style={styles.projectName}>
                              {project.name}
                          </Text>
                      </TouchableOpacity>
                  ))}
              </ScrollView>
              <View style={styles.addProject}>
                  <TouchableOpacity onPress={() => navigate('create')}>
                      <FontAwesomeIcon  icon={solid.faCirclePlus} size={75} colour='#4d4d4d'/>
                  </TouchableOpacity>
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
    },
    projects: {
        flex: 1,
        paddingTop: 50,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,
    },
    project: {
        flex: 1,
        width: '100%',
        maxHeight: 80,
        minHeight: 80,
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
    addProject: {
        flex: 1,
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        bottom: 80,
    },
});