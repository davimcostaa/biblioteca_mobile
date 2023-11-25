import { createStackNavigator } from '@react-navigation/stack'
import FormEmprestimo from './FormEmprestimo'
import ListaEmprestimos from './ListaEmprestimos'

const Stack = createStackNavigator()

export default function StackEmprestimos() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaEmprestimos'
        >
            <Stack.Screen name='ListaEmprestimos' component={ListaEmprestimos} />
            <Stack.Screen name='FormEmprestimos' component={FormEmprestimo} /> 

        </Stack.Navigator>

    )
}