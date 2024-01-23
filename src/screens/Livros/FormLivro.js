import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik';
import { Button, TextInput } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import Api from '../../services/api';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function FormLivro({navigation, route}) {
  const [token, setToken] = useState();
  const livroParaCorrecao = route.params

  useEffect(() => {
    loadToken();
  }, []);


  async function loadToken() {
    try {
      const response = await AsyncStorage.getItem('token');
      const tokenSemAspas = response.replace(/^"(.*)"$/, '$1');
      setToken(tokenSemAspas);

      if (!tokenSemAspas) {
        console.error('Token não disponível');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold
  });

if (!fontsLoaded) {
    return null;
}

    const validationSchema = Yup.object().shape({
        isbn: Yup
          .string()
          .required('Campo obrigatório')
          .min(17, 'Deve conter 17 caracteres')
          .max(50, 'Deve conter no máximo 50 caracteres'),
        ano: Yup
          .string()
          .required('Campo obrigatório')
          .min(4, 'Deve conter pelo menos 4 caracteres')
          .max(4, 'Deve conter no máximo 4 caracteres'),
        nome: Yup
          .string()
          .min(5, 'deve conter pelo menos 5 caracteres')
          .max(50, 'deve conter no máximo 50 caracteres')
          .required('Campo obrigatório'),
        classificacao: Yup
          .string()
          .min(2, 'deve conter pelo menos 2 caracteres')
          .max(5, 'deve conter no máximo 5 caracteres')
          .required('Campo obrigatório'),
        genero: Yup
          .string()
          .min(5, 'deve conter pelo menos 5 caracteres')
          .max(20, 'deve conter no máximo 20 caracteres')
          .required('Campo obrigatório'),
        foto: Yup
          .string()
          .min(5, 'deve conter pelo menos 5 caracteres')
          .max(500, 'deve conter no máximo 1000 caracteres')
          .required('Campo obrigatório'),
      });

      async function cadastrar(valores) {
        try {
          const response = await Api.post('/livros', valores, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          navigation.navigate('ListaLivros');
        } catch (error) {
          console.log(error);
        }
      }

      async function editar(id, valores) {
        try {
          const response = await Api.put('/livros/' + id, valores, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          if (response.status === 200) {
            navigation.navigate('ListaLivros')
          }
    
          
         } catch (error) {
          console.error('Error ao editar o livro:', error);
        }
      }
      

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de livros</Text>
    <Formik
          initialValues={livroParaCorrecao || {
            isbn: '',
            ano: '',
            nome: '',
            classificacao: '',
            genero: '',
            foto: ''
          }}
        validationSchema={validationSchema}
        onSubmit={values => livroParaCorrecao ? editar(livroParaCorrecao.id, values) : cadastrar(values)}
      >

        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (

          <>

            <ScrollView style={styles.inputContainer}>

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'ISBN'}
                placeholder='XXX-XX-XXX-XXXX-X'
                value={values.isbn}
                onChangeText={handleChange('isbn')}
                onBlur={handleBlur('isbn')}
                error={touched.isbn && errors.isbn}
                keyboardType='numeric'
                render={props => 
                  <TextInputMask 
                    {...props}
                    type={'custom'}
                    options={{
                    mask: '999-99-999-9999-9'
                    }}
                  />
                }
              />

              {(touched.isbn && errors.isbn) && <Text style={{ color: 'red' }}>{errors.isbn}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Nome'}
                value={values.nome}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
                error={touched.nome && errors.nome}
              />

              {(touched.nome && errors.nome) && <Text style={{ color: 'red' }}>{errors.nome}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Ano'}
                value={values.ano}
                onChangeText={handleChange('ano')}
                onBlur={handleBlur('ano')}
                error={touched.ano && errors.ano}
                keyboardType='numeric'        
              />

              {(touched.ano && errors.ano) && <Text style={{ color: 'red' }}>{errors.ano}</Text>}


              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Classificação'}
                value={values.classificacao}
                onChangeText={handleChange('classificacao')}
                onBlur={handleBlur('classificacao')}
                error={touched.classificacao && errors.classificacao}
              />

              {(touched.classificacao && errors.classificacao) && <Text style={{ color: 'red' }}>{errors.classificacao}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Gênero'}
                value={values.genero}
                onChangeText={handleChange('genero')}
                onBlur={handleBlur('genero')}
                error={touched.genero && errors.genero}
              />

              {(touched.genero && errors.genero) && <Text style={{ color: 'red' }}>{errors.genero}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Foto'}
                value={values.foto}
                onChangeText={handleChange('foto')}
                onBlur={handleBlur('foto')}
                error={touched.foto && errors.foto}
              />

              {(touched.foto && errors.foto) && <Text style={{ color: 'red' }}>{errors.foto}</Text>}

            <Button mode='contained' style={styles.botao} onPress={handleSubmit}>{livroParaCorrecao ? 'Editar' : 'Cadastrar'}</Button>

            </ScrollView>

          </>


        )}

      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer: {
      width: '85%',
      height: '100%',
      gap: 25
    },
    input: {
      width: '100%',
      height: 60
    },
    titulo: {
      fontFamily: 'OpenSans_700Bold',
      fontSize: 20,
      marginTop: 70,
      marginBottom: 30
    },
     botao: {
      backgroundColor: '#121212',
      width: 320,
      height: 57,
      marginTop: 30,
      alignItems: 'center',
      justifyContent: 'center'
     }    
})