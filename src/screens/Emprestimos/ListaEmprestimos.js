import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../services/api';
import { useFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { Button, Card, FAB, IconButton, Modal, Portal, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import StarRating from 'react-native-star-rating-widget';
import { TextInputMask } from 'react-native-masked-text';

export default function ListaEmprestimos({ navigation }) {
  const [token, setToken] = useState();
  const [devolvidos, setDevolvidos] = useState();
  const [emprestimos, setEmprestimos] = useState([]);
  const [emprestimoAtual, setEmprestimoAtual] = useState([]);
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0)
  const [atrasado, setAtrasado] = useState(false)

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useFocusEffect(
    useCallback(() => {
      loadToken();
      loadDevolvidos();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (token) {
        loadEmprestimos();
      }
    }, [token])
  );

  async function loadDevolvidos() {
    const response = await AsyncStorage.getItem('devolvidos');    
    const devolvidosStorage = response ? JSON.parse(response) : [];
    setDevolvidos(devolvidosStorage);
  }

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

  async function loadEmprestimos() {
    try {
      if (token) {
        const response = await Api.get('/emprestimos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmprestimos(response.data.data);
      }
    } catch (error) {
      console.error('Error ao carregar:', error);
    }
  }

  async function excluirEmprestimo(id) {
    try {
      const response = await Api.delete('/emprestimos/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200 || response.status == 204) {
        setEmprestimos((emprestimos) => {
          return emprestimos.filter((emprestimo) => emprestimo.id !== id);
        });
      }
    } catch (error) {
      console.error('Error ao apagar o emprestimo:', error);
    }
  }

  function salvarDevolucao() {
    console.log('Data de Devolução:', dataDevolucao);
    console.log('Avaliação:', rating);

    const dadosDevolucao = {
      id: emprestimoAtual.id,
      data_devolucao: dataDevolucao,
      avaliacao: rating,
      atrasado
    };

    if(new Date(emprestimoAtual?.data_devolucao).toLocaleDateString() > dataDevolucao) {
      dadosDevolucao.atrasado = 'sim'
    } else {  
      dadosDevolucao.atrasado = 'não'
    }

    adicionarDevolvido(dadosDevolucao)
    excluirEmprestimo(emprestimoAtual.id)
    hideModal();
    setDataDevolucao('')
    setRating('')
  }

  async function adicionarDevolvido(devolucao) {
    let novaListaDevolvidos = devolvidos; 
    novaListaDevolvidos.push(devolucao);
    await AsyncStorage.setItem('devolvidos', JSON.stringify(novaListaDevolvidos));
    setDevolvidos(novaListaDevolvidos);
  }

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Text style={styles.textoModal}>Devolução de livro</Text>
          <TextInput
            style={styles.input}
            mode='outlined'
            label={'Data da Devolução'}
            value={dataDevolucao}
            render={props =>
              <TextInputMask
                {...props}
                type={'datetime'}
              />
            }
            onChangeText={(text) => setDataDevolucao(text)}
          />

          <StarRating
            rating={rating}
            onChange={setRating}
          />

          <Button onPress={salvarDevolucao} style={styles.botao} textColor="#fff" >Clique aqui</Button>
        </Modal>
      </Portal>

      <Text style={styles.texto}>Empréstimos cadastrados</Text>

      <ScrollView style={styles.listArea}>
        <View style={styles.rowContainer}>
          {emprestimos?.map((emprestimo) => (
            <Card style={styles.card} key={emprestimo.id}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.textoCard}>
                  Cliente: {emprestimo.cliente.nome}
                </Text>
                <Text variant="bodyMedium" style={styles.textoCard}>
                  Id do exemplar: {emprestimo.exemplare.id}
                </Text>
                <Text variant="bodyMedium" style={styles.textoCard}>
                  Data da devolução: {new Date(emprestimo.data_devolucao).toLocaleDateString()}
                </Text>
              </Card.Content>
              <Card.Actions>
                <IconButton icon="delete-forever" iconColor='#fff' containerColor="#000" onPress={() => { excluirEmprestimo(emprestimo.id) }} />
                <IconButton icon="pencil-outline" iconColor='#fff' containerColor="#000" onPress={() => navigation.navigate('FormEmprestimos', emprestimo)} />
                <IconButton icon="check" iconColor='#fff' containerColor="#000" onPress={() => { setEmprestimoAtual(emprestimo); showModal(); }} />
              </Card.Actions>
            </Card>
          ))}
        </View>

        <View>
        <Text style={styles.texto}>Empréstimos cadastrados</Text>

          {devolvidos?.map((devolvido) => (
            <Card style={devolvido.atrasado == 'sim' ? styles.cardRed : styles.card} key={devolvido.id}>
            <Card.Content>
            <Text variant="bodyMedium" style={styles.textoCard}>
                Id do empréstimo: {devolvido.id}
            </Text>
            <Text variant="bodyMedium" style={styles.textoCard}>
                Data que foi devolvido: {devolvido.data_devolucao}
            </Text>
            <Text variant="titleLarge" style={styles.textoCard}>
                Avaliação do cliente: {devolvido.avaliacao}
            </Text>
            </Card.Content>
          </Card>
          ))}
        </View>
      </ScrollView>
      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('FormEmprestimos')} />
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
  textoModal: {
    fontSize: 20,
    fontFamily: 'OpenSans_400Regular',
    paddingRight: 17,
    paddingLeft: 17,
    textAlign: 'center',
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
  textoCard: {
    color: '#fff',
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    fontSize: 17
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
    marginBottom: 20,
    width: '100%',
    height: 150
  },
  cardRed: {
    backgroundColor: "#B30000",
    fontColor: "#fff",
    marginBottom: 20,
    width: '100%',
    height: 125
  },
  viewBotoes: {
    flexDirection: 'row'
  },
  modal:{
    backgroundColor: 'white', 
    padding: 20,
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input:{
    marginBottom: 30,
    width: '80%'
  },
  botao: {
    backgroundColor: '#121212',
    width: 320,
    height: 57,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  textoTeste: {
    fontSize: 20,
    color: "#000"
  }
});
