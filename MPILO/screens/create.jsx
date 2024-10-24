import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Header from '../shared/header';
import constants from '../custom/constants';
import { useUserData } from '../data/session';
import FontAwesomeIcon from '../custom/fontAwesomeIcon';
import { solid } from '../iconPaths';
import { GetData, PostData } from '../functions';

export default function Create({navigation}) {
    const navigate = navigation.navigate
    const [name, setName] = useState('')
    const {projects, setProjects} = useUserData()
    const [inputs, setInputs] = useState({
        name: 0
    })
    const [createModal, setCreateModal] = useState(false)
    const create = () => {
        const existProject = projects.find(project => project.name == name)
        if(existProject){
            setCreateModal(true)
        }
        else{
            const data = {
                name: name
            }
            PostData('/create', data).then(() => {
                GetData('/projects').then((res) => {
                    setProjects(res)
                    navigate('projects')
                })
            })
        }
    }
  return (
    <View style={styles.container}>
        <Modal  animationType='fade' visible={createModal} onRequestClose={() => setCreateModal(false)} transparent={true}>
            <View style={styles.modal}>
                <View style={styles.modalDialog}>
                    <View style={styles.modalContent}>
                        <Text style={constants.h1}>
                            A project with that name already exists
                        </Text>
                        <View style={styles.closeButton}>
                            <TouchableOpacity onPress={() => setCreateModal(false)}>
                                <FontAwesomeIcon icon={solid.faXmark} size={30} colour='#000' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
        <View style={styles.form}>
            <View style={constants.row}>
                <Text style={constants.h2}>
                    Create New Project
                </Text>
            </View>
            <View style={[constants.row, styles.username]}>
                <View style={[constants.field, styles.field]}>
                    <View style={constants.inputGroup}>
                        <View style={[constants.label, (name != '' || inputs.name == 1) && constants.labelFocus]}>
                            <Text style={[constants.labelText, (name != '' || inputs.name == 1) && constants.labelTextFocus]}>Project Name</Text>
                        </View>
                        <TextInput style={[constants.input, (name != '' || inputs.name == 1) && constants['input-focus']]} value={name} onChangeText={(text) => setName(text.toLowerCase())} onFocus={() => setInputs({name: 1})} onBlur={() => setInputs({name: 0})} required />
                    </View>
                </View>
            </View>
          <View style={constants.row}>
                <TouchableOpacity onPress={create}  style={[constants.button, constants.w100]}>
                    <Text style={[constants.white, constants.p]}>
                        Create
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        <Header navigate={navigate} active={'projects'} />
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    form: {
        flex: 1,
        paddingTop: 50,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        justifyContent: 'space-between'
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
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 8
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5
    }
});