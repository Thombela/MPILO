import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const size = {
  sm: 567,
  md: 768,
  lg: 992,
  xl: 1200
}

export const Container = ({ children, classname }) => {
    return(
        <View style={[styles.container, classname]}>
            {children}
        </View>
    )
}
export const Col = ({ children, xs, sm, md, lg, xl, classname }) => {
  return (
    <View style={[
      col.col,
      classname,
      xs && width <= size.sm && col['col-'+xs],
      sm && width >= size.sm && col['col-'+sm],
      md && width >= size.md && col['col-'+md],
      lg && width >= size.lg && col['col-'+lg],
      xl && width >= size.xl && col['col-'+xl],
      ]}>
      {children}
    </View>
  )
}
export const Row = ({ children, classname }) => {
  return (
    <View style={[row.row, classname]}>
      {children}
    </View>
  )
}
export const Tabs = ({ children, classname, defaultActiveKey = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveKey)

  const handleTabPress = (index) => {
    setActiveTab(index)
  }
  return (
    <View style={[tabs.container, classname]}>
      <View style={tabs.tabsContainer}>
        {React.Children.map(children, (tab, index) => (
          <TouchableOpacity key={index} style={[tabs.tab, index == 0 && tabs.firstTab, activeTab === index && tabs.activeTab]} onPress={() => handleTabPress(index)} >
            <Text style={tabs.tabText}>{tab.props.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={tabs.tabContent}>
        {React.Children.toArray(children)[activeTab]}
      </ScrollView>
    </View>
  )
}
export const Tab = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}

const tabs = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      width: '100%',
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      flex: 1,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    firstTab: {
      borderRightWidth: 1,
      borderRightColor: 'blue'
    },
    activeTab: {
      borderColor: 'blue',
    },
    tabText: {
      color: 'black',
    },
    tabContent: {
      //alignItems: 'center',
    },
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
})
const row = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
const col = StyleSheet.create({
  col: {
    flexGrow: 1,
    maxWidth: '100%',
  },
  'col-1': { flexBasis: '8.33%' },
  'col-2': { flexBasis: '16.66%' },
  'col-3': { flexBasis: '25%' },
  'col-4': { flexBasis: '33.33%' },
  'col-5': { flexBasis: '41.66%' },
  'col-6': { flexBasis: '50%' },
  'col-7': { flexBasis: '58.33%' },
  'col-8': { flexBasis: '66.66%' },
  'col-9': { flexBasis: '75%' },
  'col-10': { flexBasis: '83.33%' },
  'col-11': { flexBasis: '91.66%' },
  'col-12': { flexBasis: '100%' }
})