import { createStackNavigator } from '@react-navigation/stack'
import FormAssinatura from './FormAssinatura.js'
import ListaAssinaturas from './ListaAssinaturas.js'

const Stack = createStackNavigator()

export default function StackAssinaturas() {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaAssinaturas'
        >
            <Stack.Screen name='ListaAssinaturas' component={ListaAssinaturas} />
            <Stack.Screen name='FormAssinaturas' component={FormAssinatura} /> 

        </Stack.Navigator>

    )
}