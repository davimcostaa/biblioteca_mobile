import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { TextInput } from 'react-native-paper'
import * as Yup from 'yup'
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import Api from '../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function FormLogin({navigation}) {
    navigation.setOptions({headerShown: true})

    let [fontsLoaded] = useFonts({
      OpenSans_400Regular,
      OpenSans_700Bold
    });

  if (!fontsLoaded) {
      return null;
  }

  const validationSchema = Yup.object().shape({
        email: Yup
          .string()
          .email('Email inválido')
          .required('Campo obrigatório'),
        password: Yup
          .string()
          .required('Campo obrigatório')
      });

  async function login(dados) {
      const response = await Api.post('/login', dados);
      console.log('Resposta da requisição:', response.data.token); 
      await AsyncStorage.setItem('token', JSON.stringify(response.data.token));
      navigation.navigate('Tabs')
  }
      
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Preencha os campos para fazer o login</Text>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => login(values)}
      >

        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (

          <>

            <View style={{gap: 10}}>

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Email'}
                placeholder='Digite seu e-mail'
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
                  />

              {(touched.email && errors.email) && <Text style={{ color: 'red', marginBottom: 20 }}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                blurOnSubmit
                mode='outlined'
                label={'Senha'}
                value={values.password}
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password}
                keyboardType='numeric'
    
              />

              {(touched.password && errors.password) && <Text style={{ color: 'red', marginBottom: 20 }}>{errors.telefone}</Text>}

              <TouchableOpacity 
                style={styles.touchable}
                onPress={handleSubmit}
              >
                <Text style={styles.textoTouchable}> Login </Text>
            </TouchableOpacity>

            <Text style={styles.textoSenha}> Esqueceu a senha? </Text>
            </View>
          </>
        )}

      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 30, 
    alignItems: 'center'
  },
  texto: {
    fontSize: 17,
    fontFamily: 'OpenSans_700Bold',
    lineHeight: 32,
    marginBottom: 100,
    marginTop: 100,
    color: '#252525',
    textAlign: 'left'
  },
  input: {
    height: 56,
    borderColor: '#252525'
  },
    touchable: {
      backgroundColor: '#121212',
      width: 320,
      height: 57,
      marginTop: 30,
      alignItems: 'center',
      justifyContent: 'center'
  },
  textoTouchable: {
        color: '#fff',
        fontFamily: 'OpenSans_400Regular',
        fontSize: 18
  },
  textoSenha: {
    fontFamily: 'OpenSans_400Regular',
    marginTop: 10
  }
})