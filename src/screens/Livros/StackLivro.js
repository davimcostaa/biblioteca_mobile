import { createStackNavigator } from '@react-navigation/stack'
import FormLivro from './FormLivro.js'
import ListaLivros from './ListaLivros.js'

const Stack = createStackNavigator()

export default function StackLivros() {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaLivros'
        >
            <Stack.Screen name='ListaLivros' component={ListaLivros} />
            <Stack.Screen name='FormLivros' component={FormLivro} />

        </Stack.Navigator>

    )
}