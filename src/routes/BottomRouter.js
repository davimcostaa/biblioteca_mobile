import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListaLivros from '../screens/Livros/ListaLivros';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Livros" component={ListaLivros} />
      <Tab.Screen name="Livros1" component={ListaLivros} />
      <Tab.Screen name="Livros2" component={ListaLivros} />
      <Tab.Screen name="Livros3" component={ListaLivros} />
    </Tab.Navigator>
  );
}