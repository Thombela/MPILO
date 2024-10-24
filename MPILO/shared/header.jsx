import React from 'react'
import { brands, solid } from '../iconPaths'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import FontAwesomeIcon from '../custom/fontAwesomeIcon'

export default function header({active, navigate}) {
  return(
    <View style={styles.header} >
      <View style={styles.links}>
          <TouchableOpacity onPress={() => navigate('home', {calibrate: false})} style={styles.link}>
            <FontAwesomeIcon icon={solid.faHouse} size={30} colour={(active == 'home'?'#ffffff':'')} />
            <Text style={styles[(active == 'home'?'active':'')]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('projects')} style={styles.link}>
            <FontAwesomeIcon icon={brands.faUnity} size={30} colour={(active == 'projects'?'#ffffff':'')} />
            <Text style={styles[(active == 'projects'?'active':'')]}>
              Projects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('settings')} style={styles.link}>
            <FontAwesomeIcon icon={solid.faGear} size={30} colour={(active == 'settings'?'#ffffff':'')} />
            <Text style={styles[(active == 'settings'?'active':'')]}>
              Settings
            </Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#40E0D0',
    maxHeight: 80,
  },
  links: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'   
  },
  link: {
      flex: 1,
      alignItems: 'center',
  },
  active: {
    color: '#ffffff'
  }
});