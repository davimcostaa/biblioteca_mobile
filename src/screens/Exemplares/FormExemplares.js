import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormExemplar({ navigation, route }) {

  const [token, setToken] = useState();
  const exemplarParaCorrecao = route.params;
  console.log(exemplarParaCorrecao)

  useEffect(() => {
    loadToken();
  }, []);

  async function loadToken() {
    try {
      const response = await AsyncStorage.getItem('token');
      console.log(response);
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
    livroId: Yup.string()
      .min(1, 'Deve conter pelo menos 1 caracteres')
      .max(15, 'Deve conter no máximo 1 caracteres')
      .required('Campo obrigatório'),
    localizacao: Yup.string()
      .required('Campo obrigatório')
  });

  async function cadastrar(valores) {
    console.log(valores);
    try {
      const response = await Api.post('/exemplares', valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      navigation.navigate('ListaExemplares');
    } catch (error) {
      console.log(error);
    }
  }

  async function editar(id, valores) {
    try {
      const response = await Api.put('/exemplares/' + id, valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        navigation.navigate('ListaExemplares')
      }

    } catch (error) {
      console.error('Error ao editar o exemplar:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de exemplares</Text>
      <Formik
        initialValues={{
          livroId: exemplarParaCorrecao?.livro_id.toString() || '',
          localizacao: exemplarParaCorrecao?.localizacao || '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => exemplarParaCorrecao ? editar(exemplarParaCorrecao.id, values) : cadastrar(values)}
      >

        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            <ScrollView style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Livro'}
                value={values.livroId}
                onChangeText={handleChange('livroId')}
                onBlur={handleBlur('livroId')}
                error={touched.livroId && errors.livroId}
              />

              {(touched.livroId && errors.livroId) && <Text style={{ color: 'red' }}>{errors.livroId}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Localização'}
                value={values.localizacao}
                onChangeText={handleChange('localizacao')}
                onBlur={handleBlur('localizacao')}
                error={touched.localizacao && errors.localizacao}
              />
              {(touched.localizacao && errors.localizacao) && <Text style={{ color: 'red' }}>{errors.localizacao}</Text>}

              <Button mode='contained' style={styles.botao} onPress={handleSubmit}>{exemplarParaCorrecao ? 'Editar' : 'Cadastrar'}</Button>

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
    gap: 50
  },
  input: {
    width: '100%',
    height: 60,
    marginBottom: 40
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
