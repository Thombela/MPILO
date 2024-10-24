import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import {useUserData} from '../data/session'
import Header from '../shared/header'
import constant from '../custom/constants'
import FontAwesomeIcon from '../custom/fontAwesomeIcon'
import {solid} from '../iconPaths'

export default function Settings({navigation}) {
    const navigate = navigation.navigate
    const {userData, setUserData} = useUserData()
  return (
    <View style={styles.page}>
        <View style={styles.settings}>
            <View style={styles.heading}>
                <Text style={constant.h1}>
                    Settings
                </Text>
            </View>
            <View style={constant.col}>
                <View style={styles.subHeading}>
                    <Text style={constant.h5}>
                        Render Type
                    </Text>
                </View>
                <View style={styles.settingContent}>
                    <View style={styles.options}>
                        <TouchableOpacity style={[styles.left, userData.renderType == 'perspective'?styles.choiceActive:styles.choice, userData.constructionType == 'stereo'?styles.disabled:'']} onPress={() => setUserData({...userData, renderType: 'perspective'})}>
                            <Text style={[userData.renderType == 'perspective'?styles.optionTextActive:styles.optionText, userData.constructionType == 'stereo'?styles.disabled:'']}>
                                Perspective View
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.right, userData.renderType == '3d'?styles.choiceActive:styles.choice, userData.constructionType == 'stereo'?styles.disabled:'']} onPress={() => setUserData({...userData, renderType: '3d'})}>
                            <Text style={[userData.renderType == '3d'?styles.optionTextActive:styles.optionText, userData.constructionType == 'stereo'?styles.disabled:'']}>
                                3D View
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={constant.col}>
                <View style={styles.subHeading}>
                    <Text style={constant.h5}>
                        Post Processing
                    </Text>
                </View>
                <View style={styles.settingContent}>
                    <View style={styles.options}>
                        <TouchableOpacity style={[styles.left, userData.postProcessing == 'enabled'?styles.choiceActive:styles.choice, userData.constructionType == 'stereo' || userData.renderType == '3d'?styles.disabled:'']} onPress={() => setUserData({...userData, postProcessing: 'enabled'})}>
                            <Text style={[userData.postProcessing == 'enabled'?styles.optionTextActive:styles.optionText, userData.constructionType == 'stereo' || userData.renderType == '3d'?styles.disabled:'']}>
                                Enabled
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.right, userData.postProcessing == 'disabled'?styles.choiceActive:styles.choice, userData.constructionType == 'stereo' || userData.renderType == '3d'?styles.disabled:'']} onPress={() => setUserData({...userData, postProcessing: 'disabled'})}>
                            <Text style={[userData.postProcessing == 'disabled'?styles.optionTextActive:styles.optionText, userData.constructionType == 'stereo' || userData.renderType == '3d'?styles.disabled:'']}>
                                Disabled
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={constant.col}>
                <View style={styles.subHeading}>
                    <Text style={constant.h5}>
                        Camera Calibration
                    </Text>
                </View>
                <View style={styles.settingContent}>
                    <TouchableOpacity style={styles.logout} onPress={() => navigate('home', {calibrate: true})}>
                        <FontAwesomeIcon icon={solid.faCamera} size={50} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={constant.col}>
                <View style={styles.subHeading}>
                    <Text style={constant.h5}>
                        Logout
                    </Text>
                </View>
                <View style={styles.settingContent}>
                    <TouchableOpacity style={styles.logout} onPress={() => navigate('login')}>
                        <FontAwesomeIcon icon={solid.faRightFromBracket} size={50} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <Header navigate={navigate} active={'settings'} />
    </View>
  )
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    settings: {
        flex: 1
    },
    heading: {
        flex: 1,
        maxHeight: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    subHeading: {
        flex: 1,
        maxHeight: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    settingContent: {
        flex: 1,
        flexDirection: 'column'
    },
    options: {
        height: 80,
        borderRadius: 30,
        flexDirection: 'row',
        marginRight: 20,
        marginLeft: 20,
    },
    choice: {
        borderColor: '#BDBDBD',
        backgroundColor: '#EBEBEB',
        borderWidth: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    choiceActive: {
        borderColor: '#40E0D0',
        backgroundColor: '#D2FFEF',
        borderWidth: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        color: '#BDBDBD',
    },
    optionTextActive: {
        color: '#40E0D0',
    },
    left: {
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
    },
    right: {
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
    },
    disabled: {
        backgroundColor: '#BDBDBD',
        color: '#BDBDBD',
        borderColor: '#BDBDBD',
    },
    logout: { 
        alignItems: 'center'
    }
})