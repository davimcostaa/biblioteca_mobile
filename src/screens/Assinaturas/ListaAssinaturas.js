import { StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../services/api';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import { Button, Card, FAB, IconButton, Modal, Portal } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ListaAssinaturas({ navigation }) {
  const [token, setToken] = useState();
  const [assinaturas, setAssinaturas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadToken();
    }, [])
  );
  
  useFocusEffect(
    useCallback(() => {
      if (token) {
        loadAssinaturas();
      }
    }, [token])
  );

  async function loadToken() {
    try {
      const response = await AsyncStorage.getItem('token');
      const tokenSemAspas = response.replace(/^"(.*)"$/, '$1');
      setToken(tokenSemAspas);

      if (!tokenSemAspas) {
        console.error('Token não disponível');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async function loadAssinaturas() {
    try {
      if (token) {
        const response = await Api.get('/assinaturas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssinaturas(response.data.data);
      }
    } catch (error) {
      console.error('Error ao carregar:', error);
    }
  }

  async function excluirAssinatura(id) {
    try {
      const response = await Api.delete('/assinaturas/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200 || response.status == 204) {
        setAssinaturas((assinaturas) => {
          return assinaturas.filter((assinatura) => assinatura.id !== id);
        });
      }
    } catch (error) {
      console.error('Error ao apagar a assinatura:', error);
    }
  }

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold
  });

  if (!fontsLoaded) {
      return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Assinaturas cadastradas</Text>

      <ScrollView style={styles.listArea}>
        <View style={styles.rowContainer}>
          {assinaturas?.map((assinatura) => (
             <Card.Title
             key={assinatura.id}
             style={styles.card}
             titleStyle={{color: '#fff'}}
             subtitleStyle={{color: '#fff'}}
             title={assinatura.tipo_assinatura}
             subtitle={`Limite de dias: ${assinatura.limite_dias}`}
             right={(props) => 
             <View style={styles.viewBotoes}>
                {/* <IconButton {...props} icon="dots-vertical" iconColor='#fff' onPress={showModal} /> */}
                <IconButton {...props} icon="delete-forever" iconColor='#fff' onPress={() => {excluirAssinatura(assinatura.id)}} />
                <IconButton {...props} icon="pencil-outline" iconColor='#fff' onPress={() => navigation.navigate('FormAssinaturas', assinatura)} />
             </View>
            }
            
           />
          ))}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('FormAssinaturas')}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    fontSize: 20,
    paddingTop: 70,
    fontFamily: 'OpenSans_400Regular',
    paddingRight: 17,
    paddingLeft: 17,
    paddingBottom: 30,
  },
  listArea: {
    width: '95%',
  },
  rowContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    marginBottom: 20,
    width: '48%',
    overflow: 'hidden', 
  },
  imageContainer: {
    backgroundColor: '#B8B8B8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden', 
    height: 200, 
  },
  textContainer: {
    backgroundColor: '#000',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 90, 
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textoLivro: {
    color: '#fff',
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    fontSize: 16
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: "#000",
    fontColor: "#fff",
    marginBottom: 20
  },
  viewBotoes: {
    flexDirection: 'row'
  },
  modal: {
    backgroundColor: 'white', 
    padding: 20,
    height: '60%'
  }
});
