import { createStackNavigator } from '@react-navigation/stack'
import FormExemplar from './FormExemplares'
import ListaExemplares from './ListaExemplares'


const Stack = createStackNavigator()

export default function StackExemplares() {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaExemplares'
        >
            <Stack.Screen name='ListaExemplares' component={ListaExemplares} />
            <Stack.Screen name='FormExemplares' component={FormExemplar} /> 

        </Stack.Navigator>

    )
}