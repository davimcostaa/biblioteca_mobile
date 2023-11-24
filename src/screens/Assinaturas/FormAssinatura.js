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

export default function FormAssinatura({ navigation, route }) {

const [token, setToken] = useState();
const assinaturaParaCorrecao = route.params;
console.log(assinaturaParaCorrecao)

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
  tipoAssinatura: Yup.string()
    .min(5, 'Deve conter pelo menos 5 caracteres')
    .max(50, 'Deve conter no máximo 50 caracteres')
    .required('Campo obrigatório'),
  limiteEmprestimo: Yup.number()
    .required('Campo obrigatório')
    .positive('Deve ser um número positivo'),
  limiteDias: Yup.string()
    .required('Campo obrigatório')
});

async function cadastrar(valores) {
  console.log(valores);
  try {
    const response = await Api.post('/assinaturas', valores, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    navigation.navigate('ListaAssinaturas');
  } catch (error) {
    console.log(error);
  }
}

async function editar(id, valores) {
  try {
    const response = await Api.put('/assinaturas/' + id, valores, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      navigation.navigate('ListaAssinaturas')
    }

  } catch (error) {
    console.error('Error ao editar a assinatura:', error);
  }
}

return (
  <View style={styles.container}>
    <Text style={styles.titulo}>Cadastro de assinaturas</Text>
    <Formik
      initialValues={{
        tipoAssinatura: assinaturaParaCorrecao?.tipo_assinatura || '',
        limiteEmprestimo: assinaturaParaCorrecao?.limite_emprestimo?.toString() || '',
        limiteDias: assinaturaParaCorrecao?.limite_dias?.toString() || '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => assinaturaParaCorrecao ? editar(assinaturaParaCorrecao.id, values) : cadastrar(values)}
    >

      {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
        <>
          <ScrollView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              mode='outlined'
              label={'Tipo de Assinatura'}
              value={values.tipoAssinatura}
              onChangeText={handleChange('tipoAssinatura')}
              onBlur={handleBlur('tipoAssinatura')}
              error={touched.tipoAssinatura && errors.tipoAssinatura}
            />
            {(touched.tipoAssinatura && errors.tipoAssinatura) && <Text style={{ color: 'red' }}>{errors.tipoAssinatura}</Text>}

            <TextInput
              style={styles.input}
              mode='outlined'
              label={'Limite de Empréstimo'}
              value={values.limiteEmprestimo}
              onChangeText={handleChange('limiteEmprestimo')}
              onBlur={handleBlur('limiteEmprestimo')}
              error={touched.limiteEmprestimo && errors.limiteEmprestimo}
              keyboardType='numeric'
            />
            {(touched.limiteEmprestimo && errors.limiteEmprestimo) && <Text style={{ color: 'red' }}>{errors.limiteEmprestimo}</Text>}

            <TextInput
              style={styles.input}
              mode='outlined'
              label={'Limite de Dias'}
              value={values.limiteDias}
              onChangeText={handleChange('limiteDias')}
              onBlur={handleBlur('limiteDias')}
              error={touched.limiteDias && errors.limiteDias}
            />
            {(touched.limiteDias && errors.limiteDias) && <Text style={{ color: 'red' }}>{errors.limiteDias}</Text>}

            <Button mode='contained' style={styles.botao} onPress={handleSubmit}>{assinaturaParaCorrecao ? 'Editar' : 'Cadastrar'}</Button>

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