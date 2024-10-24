import React from 'react'
import { Path, Svg } from 'react-native-svg'

export default function FontAwesomeIcon( { icon, colour = '#000000A6', size = 20 }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 640 512">
        <Path d={icon} fill={colour != ''?colour:'#000000A6'} />
    </Svg>
  )
}
