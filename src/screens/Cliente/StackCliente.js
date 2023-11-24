import { createStackNavigator } from '@react-navigation/stack'
import FormCliente from './FormCliente'
import ListaClientes from './ListaCliente'

const Stack = createStackNavigator()

export default function StackCliente() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaClientes'
        >
            <Stack.Screen name='ListaClientes' component={ListaClientes} />
            <Stack.Screen name='FormClientes' component={FormCliente} /> 

        </Stack.Navigator>

    )
}