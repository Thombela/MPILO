import React, { useState } from 'react'
import constants from '../custom/constants'
import {SafeAreaView, View, Image, StyleSheet, TouchableOpacity, Text, TextInput} from 'react-native';
import { useUserData } from '../data/session';

export default function Login({navigation}) {
    const navigate = navigation.navigate
    const {userData, setUserData} = useUserData()

    const [loginData, setLoginData] = useState({
      username: '',
      password: ''
    })

    
    const [inputs, setInputs] = useState({
        username: 0,
        password: 0
    })
    
  const login = () => {
        const data = {
            LoginUser: 1,
            username: loginData.username,
            password: loginData.password,
        }
        setUserData({...userData,...data})
        navigate('projects')
    }
    const handleTextInput = (name, value) => {
      setLoginData({
        ...loginData,
        [name]: value
      })
    }
    const blur = (name) => {
      setInputs({
        ...inputs,
        [name]: 0
      })
    }
    const focus = (name) => {
      setInputs({
        ...inputs,
        [name]: 1
      })
    }
  return (
    <SafeAreaView style={styles.login}>
      <View style={styles.main}>
        <View style={[styles.form, styles.container, constants.container]}>
          <View style={[constants.row, styles.row]}>
            <View style={styles.imageContainer}>
              <Image style={styles.img} source={require("../assets/logo.png")} />
            </View>
          </View>
          <View style={[constants.row, styles.username]}>
            <View style={[constants.field, styles.field]}>
              <View style={constants.inputGroup}>
                <View style={[constants.label, (loginData.username != '' || inputs.username == 1) && constants.labelFocus]}>
                  <Text style={[constants.labelText, (loginData.username != '' || inputs.username == 1) && constants.labelTextFocus]}>Username</Text>
                </View>
                <TextInput style={[constants.input, (loginData.username != '' || inputs.username == 1) && constants['input-focus']]} value={loginData.username} onChangeText={(text) => handleTextInput("username", text)} onFocus={() => focus('username')} onBlur={() => blur('username')} required />
              </View>
            </View>
          </View>
          <View style={constants.row}>
            <View style={[constants.field, styles.field]}>
              <View style={constants.inputGroup}>
                <View style={[constants.label, (loginData.password != '' || inputs.password == 1) && constants.labelFocus]}>
                  <Text style={[constants.labelText, (loginData.password != '' || inputs.password == 1) && constants.labelTextFocus]}>Password</Text>
                </View>
                <TextInput secureTextEntry={true} style={[constants.input, (loginData.password != '' || inputs.password) && constants['input-focus']]} value={loginData.password}  onChangeText={(text) => handleTextInput("password", text)} onFocus={() => focus('password')} onBlur={() => blur('password')}  required />
              </View>
            </View>
          </View>
          <View style={constants.row}>
            <TouchableOpacity onPress={login}  style={[constants.button, constants.w100]}>
              <Text style={[constants.white, constants.p]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    login: {
        flex: 1,
        justifyContent: 'center',
    },
    main: {
        flex: 1,
        width: '100%',
    },
    form: {
        flex: 1,
        borderWidth: 1, // No 'px' in React Native
        borderStyle: 'solid',
        borderColor: '#4f4f4f',
        borderRadius: 10, // No 'px' in React Native
        margin: 30, // Use margin instead of marginWidth
        padding: 30, // Use padding instead of paddingWidth
        maxWidth: 500, // No 'px'
        position: 'relative', // Corrected to be a string
        justifyContent: 'space-around'
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: 150,
        height: 150,
    },
    img: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
    row: {
        margin: 10, // No 'px'
        height: 200,
        marginBottom: 80
    },
    parentButtons: {
        margin: 5, // No 'px'
    },
    field: {
        margin: 20, // No 'px'
    },
    username: {
        justifyContent: 'flex-end'
    }
});
