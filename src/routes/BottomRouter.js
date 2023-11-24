import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListaLivros from '../screens/Livros/ListaLivros';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StackLivros from '../screens/Livros/StackLivro';
import StackAssinaturas from '../screens/Assinaturas/StackAssinaturas';
import StackExemplares from '../screens/Exemplares/StackExemplares';
import StackCliente from '../screens/Cliente/StackCliente';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
    initialRouteName="Livros"
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#000',
        tabBarActiveBackgroundColor: "#000",
        tabBarInactiveBackgroundColor: "#fff",
        headerShown: false
      }}
      >
      <Tab.Screen name="Livros" component={StackLivros}
      options={{
        tabBarLabel: 'Livros',
        tabBarIcon: ({ color, size }) => {
            return <Ionicons name='book' color={color} size={size} />
        }
    }}
    />

    <Tab.Screen name="Assinaturas" component={StackAssinaturas}
      options={{
        tabBarLabel: 'Assinaturas',
        tabBarIcon: ({ color, size }) => {
            return <Ionicons name='wallet' color={color} size={size} />
        }
    }}
    />

    <Tab.Screen name="Exemplares" component={StackExemplares}
      options={{
        tabBarLabel: 'Exemplares',
        tabBarIcon: ({ color, size }) => {
            return <Ionicons name='library' color={color} size={size} />
        }
    }}
    />
    <Tab.Screen name="Clientes" component={StackCliente}
      options={{
        tabBarLabel: 'Clientes',
        tabBarIcon: ({ color, size }) => {
            return <Ionicons name='person' color={color} size={size} />
        }
    }}
    />
    <Tab.Screen name="Livros3" component={ListaLivros} />
    </Tab.Navigator>
  );
}