import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/home';
import Projects from './screens/projects';
import Login from './screens/login';
import Display from './screens/display';
import Create from './screens/create';
import Settings from './screens/settings';
import { UserDataProvider } from './data/session';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <UserDataProvider>
        <Stack.Navigator initialRouteName='projects'>
          <Stack.Group screenOptions={{ headerShown: false, gestureEnabled: false }} >
            <Stack.Screen name='home' component={Home} />
            <Stack.Screen name='projects' component={Projects} />
            <Stack.Screen name='login' component={Login} />
            <Stack.Screen name='display' component={Display} />
            <Stack.Screen name='create' component={Create} />
            <Stack.Screen name='settings' component={Settings} />
          </Stack.Group>
        </Stack.Navigator>
      </UserDataProvider>
    </NavigationContainer>
  )
}