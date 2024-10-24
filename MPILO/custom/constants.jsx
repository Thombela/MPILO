import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const constants = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusedInput: {
        borderWidth: 0,            // Removes border
        borderRadius: 0,           // Removes border radius
        boxShadow: 'none',         // Removes shadow
        outline: 'none',           // Removes outline
        backgroundColor: 'transparent',
    },
    button: {
        height: 50,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#40E0D0', // orangeTextHover equivalent
        color: '#fff',
        borderRadius: 50,
        borderWidth: 0,
        cursor: 'pointer',
        fontSize: 14,
        alignItems: 'center',
    },
    w100: {
        flex: 1,
        width: '100%'
    },
    buttonBorder: {
        height: 50,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
        borderColor: '#FFA500', // orangeTextHover equivalent
        borderWidth: 1,
        borderRadius: 50,
        color: '#000',
    },
    danger: {
        height: 50,
        backgroundColor: '#ff4444', // dangerText equivalent
        color: '#fff',
        borderRadius: 50,
    },
    dangerBorder: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ff4444', // dangerHoverText equivalent
        color: '#000',
        borderRadius: 50,
    },
    blueButton: {
        height: 50,
        backgroundColor: '#0000FF', // blue equivalent
        color: '#fff',
        borderRadius: 50,
    },
    blueSquareButton: {
        height: 50,
        backgroundColor: '#0000FF', // blue equivalent
        borderRadius: 10,
    },
    br: {
        height: 20,
        width: '100%',
    },
    inputGroup: {
        flex: 1,
        position: 'relative',
        width: '100%',
        maxHeight: 50
    },
    field: {
        flex: 1,
        width: '100%'
    },
    input: {
        flex: 1,
        width: '100%',
        maxHeight: 40,
        color: '#000',
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        borderRadius: 5,
        paddingHorizontal: 10,
        transition: 'background-color 5000s ease-in-out 0s',
    },
    label: {
        position: 'absolute',
        left: 10,
        top: 8,
        backgroundColor: 'transparent',
    },
    labelFocus: {
        position: 'absolute',
        left: 10,
        top: -7,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 2,
        zIndex: 3,
    },
    labelText: {
      fontSize: 16,           // Default label size
      color: '#000',
    },
    labelTextFocus: {
      fontSize: 12,           // Smaller label size on focus
      color: '#000',
    },
    parentButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    row: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    col: {
        flex: 1,
        flexDirection: 'column',
    },
    white: {
        color: '#fff',
    },
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    h3: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    h4: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    h5: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    h6: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    screen: {
        height: 800,
    },
    map: {
        width: '100%',
        aspectRatio: 1,
    },
    chart: {
        borderRadius: 16,
    },
    hide: {
        display: 'none'
    }
});

export default constants;
