import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../services/api';
import {
  useFonts,
  OpenSans_400Regular,
} from '@expo-google-fonts/open-sans';
import { Button, FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ListaLivros({navigation}) {
  const [token, setToken] = useState();
  const [livros, setLivros] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadToken();
    }, [])
  );
  
  useFocusEffect(
    useCallback(() => {
      if (token) {
        loadLivros();
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

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  async function loadLivros() {
    try {
      if (token) {
        const response = await Api.get('/livros', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLivros(response.data.data);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }
  

  async function excluirLivro(id) {
    try {
      const response = await Api.delete('/livros/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status == 200 || response.status == 204) {
        setLivros(livros => {
          return livros.filter(livro => livro.id !== id)
        })
      }
     } catch (error) {
      console.error('Error ao apagar o livro:', error);
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Livros cadastrados</Text>
      <ScrollView style={styles.listArea}>
        <View style={styles.rowContainer}>
          {livros?.map((livro, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: livro.foto }} style={styles.image} resizeMode='contain' />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.textoLivro}>
                  {livro.nome}
                  </Text>
                  <View style={styles.buttonsContainer}>
                    <Button icon="delete-forever" style={{tintColor: '#fff'}} onPress={() => excluirLivro(livro.id)}  />
                    <Button icon="pencil-outline" onPress={() => navigation.navigate('FormLivros', livro)} />
                  </View>  
              </View>

            </View>
          ))}
        </View>
      </ScrollView>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('FormLivros')}
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
    paddingTop: 30,
    fontFamily: 'OpenSans_400Regular',
    paddingRight: 17,
    paddingLeft: 17,
    paddingBottom: 30,
  },
  listArea: {
    width: '95%',
  },
  rowContainer: {
    flexDirection: 'row',
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
});
