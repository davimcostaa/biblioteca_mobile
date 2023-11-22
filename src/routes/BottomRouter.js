import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListaLivros from '../screens/Livros/ListaLivros';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StackLivros from '../screens/Livros/StackLivro';

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
      <Tab.Screen name="Livros1" component={ListaLivros} />
      <Tab.Screen name="Livros2" component={ListaLivros} />
      <Tab.Screen name="Livros3" component={ListaLivros} />
    </Tab.Navigator>
  );
}