import { createStackNavigator } from '@react-navigation/stack'
import FormLogin from '../screens/FormLogin'
import Login from '../screens/Home'
import StackLivros from '../screens/Livros/StackLivro'
import MyTabs from './BottomRouter'

const Stack = createStackNavigator()

export default function StackPrincipal() {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='Login'
        >

            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='FormLogin' component={FormLogin} />
            <Stack.Screen name='Livros' component={StackLivros} />
            <Stack.Screen name='Tabs' component={MyTabs} />

        </Stack.Navigator>

    )
}