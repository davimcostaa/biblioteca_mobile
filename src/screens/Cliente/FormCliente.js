import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik';
import { Button, TextInput } from 'react-native-paper';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import Api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';

export default function FormCliente({ navigation, route }) {

  const [token, setToken] = useState();
  const clienteParaCorrecao = route.params;
  console.log(clienteParaCorrecao)

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
    cpf: Yup.string()
      .required('Campo obrigatório'),
    codigo: Yup.string()
      .required('Campo obrigatório'),
    nome: Yup.string()
      .required('Campo obrigatório'),
    email: Yup.string()
      .email('E-mail inválido')
      .required('Campo obrigatório'),
    dataNascimento: Yup.string()
      .required('Campo obrigatório'),
    telefone: Yup.string()
      .required('Campo obrigatório'),
    assinaturaId: Yup.number()
      .required('Campo obrigatório'),
  });

  async function cadastrar(valores) {
    console.log(valores);
    try {
      const response = await Api.post('/clientes', valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      navigation.navigate('ListaClientes');
    } catch (error) {
      console.log(error);
    }
  }

  async function editar(id, valores) {
    try {
      const response = await Api.put('/clientes/' + id, valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        navigation.navigate('ListaClientes')
      }

    } catch (error) {
      console.error('Error ao editar o cliente:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de clientes</Text>
      <Formik
        initialValues={{
          cpf: clienteParaCorrecao?.cpf || '',
          codigo: clienteParaCorrecao?.codigo || '',
          nome: clienteParaCorrecao?.nome || '',
          email: clienteParaCorrecao?.email || '',
          dataNascimento: clienteParaCorrecao?.dataNascimento || '',
          telefone: clienteParaCorrecao?.telefone || '',
          assinaturaId: clienteParaCorrecao?.assinaturaId || '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => clienteParaCorrecao ? editar(clienteParaCorrecao.id, values) : cadastrar(values)}
      >

        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            <ScrollView style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                mode='outlined'
                label={'CPF'}
                value={values.cpf}
                onChangeText={handleChange('cpf')}
                onBlur={handleBlur('cpf')}
                error={touched.cpf && errors.cpf}

              />

              {(touched.cpf && errors.cpf) && <Text style={{ color: 'red' }}>{errors.cpf}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Código'}
                value={values.codigo}
                onChangeText={handleChange('codigo')}
                onBlur={handleBlur('codigo')}
                error={touched.codigo && errors.codigo}
              />

              {(touched.codigo && errors.codigo) && <Text style={{ color: 'red' }}>{errors.codigo}</Text>}

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
                label={'E-mail'}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />

              {(touched.email && errors.email) && <Text style={{ color: 'red' }}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Data de Nascimento'}
                value={values.dataNascimento}
                onChangeText={handleChange('dataNascimento')}
                onBlur={handleBlur('dataNascimento')}
                error={touched.dataNascimento && errors.dataNascimento}
              />

              {(touched.dataNascimento && errors.dataNascimento) && <Text style={{ color: 'red' }}>{errors.dataNascimento}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Telefone'}
                value={values.telefone}
                onChangeText={handleChange('telefone')}
                onBlur={handleBlur('telefone')}
                error={touched.telefone && errors.telefone}
                render={props =>
                  <TextInputMask
                    {...props}
                    type={'cel-phone'}
                  />
                }
              />

              {(touched.telefone && errors.telefone) && <Text style={{ color: 'red' }}>{errors.telefone}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                keyboardType='numeric'
                label={'ID da Assinatura'}
                value={values.assinaturaId}
                onChangeText={handleChange('assinaturaId')}
                onBlur={handleBlur('assinaturaId')}
                error={touched.assinaturaId && errors.assinaturaId}
              />

              {(touched.assinaturaId && errors.assinaturaId) && <Text style={{ color: 'red' }}>{errors.assinaturaId}</Text>}

              <Button mode='contained' style={styles.botao} onPress={handleSubmit}>{clienteParaCorrecao ? 'Editar' : 'Cadastrar'}</Button>

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
