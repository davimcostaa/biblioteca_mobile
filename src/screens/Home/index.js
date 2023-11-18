import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import livros from '../../../assets/livros.png'
import logo from '../../../assets/logo.png'
import {
    useFonts,
    OpenSans_400Regular,
  } from '@expo-google-fonts/open-sans';

const Login = ({navigation}) => {

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
      });

    if (!fontsLoaded) {
        return null;
    }

  return (
      <ImageBackground source={livros} style={styles.imagem}>
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.texto}>Gerencie sua livraria com facilidade!</Text>

            <TouchableOpacity 
                style={styles.touchable}
                onPress={() => navigation.navigate('FormLogin')}
                >
                <Text style={styles.textoTouchable}> Login </Text>
            </TouchableOpacity>
        </View> 
      </ImageBackground>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    imagem: {
        width: '100%',
        height: '78%',
    }, 
    logo: {
        marginTop: 400
    },
    texto: {
        fontSize: 20,
        paddingTop: 30,
        fontFamily: 'OpenSans_400Regular',
        paddingRight: 17,
        paddingLeft: 17,
    },
    touchable: {
        backgroundColor: '#121212',
        width: 320,
        height: 57,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textoTouchable: {
        color: '#fff',
        fontFamily: 'OpenSans_400Regular',
        fontSize: 18
    }
})