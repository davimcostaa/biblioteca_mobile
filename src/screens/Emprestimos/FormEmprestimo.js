import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik';
import { Button, TextInput } from 'react-native-paper';
import Api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { TextInputMask } from 'react-native-masked-text';
import { format, parse } from 'date-fns';

export default function FormEmprestimo({ navigation, route }) {

  const [token, setToken] = useState();
  const [clientes, setClientes] = useState();
  const [exemplares, setExemplares] = useState();
  const emprestimoParaCorrecao = route.params;

  useFocusEffect(
    useCallback(() => {
      loadToken();
    }, [])
  );
  
  useFocusEffect(
    useCallback(() => {
      if (token) {
        carregarClientes();
        carregarExemplares();
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
      console.error('Error:', error);
    }
  }

  async function carregarClientes() {
    try {
      if (token) {
        const response = await Api.get('/clientes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientes(response.data.data);
      }
    } catch (error) {
      console.error('Error ao carregar clientes:', error);
    }
  }

  async function carregarExemplares() {
    try {
      if (token) {
        const response = await Api.get('/exemplares', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExemplares(response.data.data);
      }
    } catch (error) {
      console.error('Error ao carregar clientes:', error);
    }
  }

  const validationSchema = Yup.object().shape({
    clienteId: Yup.number()
      .required('Campo obrigatório'),
    exemplareId: Yup.number()
      .required('Campo obrigatório'),
    dataEmprestimo: Yup.string()
      .required('Campo obrigatório'),
    dataDevolucao: Yup.string()
      .required('Campo obrigatório'),
  });

  async function cadastrar(valores) {
    const valoresParaAPI = {
      ...valores,
      dataEmprestimo: converterDataBrParaUs(valores.dataEmprestimo),
      dataDevolucao: converterDataBrParaUs(valores.dataDevolucao),
    };


    try {
      const response = await Api.post('/emprestimos', valoresParaAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.navigate('ListaEmprestimos');
    } catch (error) {
      console.log(error);
    }
  }

  async function editar(id, valores) {
    try {
      const response = await Api.put('/emprestimos/' + id, valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigation.navigate('ListaEmprestimos');
      }

    } catch (error) {
      console.error('Error ao editar o emprestimo:', error);
    }
  }

  function converterDataBrParaUs(dataBr) {
    const dataObj = parse(dataBr, 'dd/MM/yyyy', new Date());
    return format(dataObj, 'yyyy-MM-dd');
  }

  const listaClienteSelect = clientes?.map(cliente => ({ key: cliente.id.toString(), value: cliente.nome }));
  const listaExemplaresSelect = exemplares?.map(exemplar => ({ key: exemplar.id.toString(), value: exemplar.id.toString() }));

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de empréstimos</Text>
      <Formik
        initialValues={{
          clienteId: emprestimoParaCorrecao?.cliente_id.toString() || '',
          exemplareId: emprestimoParaCorrecao?.exemplare_id.toString() || '',
          dataEmprestimo: emprestimoParaCorrecao?.data_emprestimo || '',
          dataDevolucao: emprestimoParaCorrecao?.data_devolucao || '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => emprestimoParaCorrecao ? editar(emprestimoParaCorrecao.id, values) : cadastrar(values)}
      >

        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            <ScrollView style={styles.inputContainer}>
            <SelectList 
                setSelected={handleChange('clienteId')} 
                data={listaClienteSelect} 
                save="key"
                boxStyles={styles.input}
                searchPlaceholder='Selecione um cliente'
                />

              {(touched.clienteId && errors.clienteId) && <Text style={{ color: 'red' }}>{errors.clienteId}</Text>}

              <SelectList 
                setSelected={handleChange('exemplareId')} 
                data={listaExemplaresSelect} 
                save="key"
                boxStyles={styles.input}
                searchPlaceholder='Selecione um id de exemplar'
                />

              {(touched.exemplareId && errors.exemplareId) && <Text style={{ color: 'red' }}>{errors.exemplareId}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Data do Empréstimo'}
                value={values.dataEmprestimo}
                onChangeText={handleChange('dataEmprestimo')}
                onBlur={handleBlur('dataEmprestimo')}
                error={touched.dataEmprestimo && errors.dataEmprestimo}
                render={props =>
                  <TextInputMask
                    {...props}
                    type={'datetime'}
                  />
                }
              />

              {(touched.dataEmprestimo && errors.dataEmprestimo) && <Text style={{ color: 'red' }}>{errors.dataEmprestimo}</Text>}

              <TextInput
                style={styles.input}
                mode='outlined'
                label={'Data de Devolução'}
                value={values.dataDevolucao}
                onChangeText={handleChange('dataDevolucao')}
                onBlur={handleBlur('dataDevolucao')}
                error={touched.dataDevolucao && errors.dataDevolucao}
                render={props =>
                  <TextInputMask
                    {...props}
                    type={'datetime'}
                  />
                }
              />

              {(touched.dataDevolucao && errors.dataDevolucao) && <Text style={{ color: 'red' }}>{errors.dataDevolucao}</Text>}


              <Button mode='contained' style={styles.botao} onPress={handleSubmit}>{emprestimoParaCorrecao ? 'Editar' : 'Cadastrar'}</Button>

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
    marginTop: 40
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
