import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import StackPrincipal from './src/routes/Router';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StackPrincipal />
      </NavigationContainer>
    </PaperProvider>
  );
}


