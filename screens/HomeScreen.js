import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image} from 'react-native';
import {Navigation} from 'react-native-navigation';
import RegulationsScreen from './RegulationsScreen';
import SQLite from "react-native-sqlite-storage";
import SplashScreen from 'react-native-splash-screen';
import getDate from '../components/getDate';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
const _ = require('lodash');

// Debugger SQLite
SQLite.DEBUG(false);

// Otworzenie bazy danych
const db = SQLite.openDatabase({name: 'quiz_databasee.db', createFromLocation: '~www/quiz.db'});

export default class HomeScreen extends Component {
    constructor(){
        super();
        this.state = {
            result: null,
            resultDatabase: null,
            questions: null,
            nick: null
        }
    }

    async componentDidMount() {
        SplashScreen.hide();
        this.getNickname();
        NetInfo.fetch().then(state => {
            console.log("Typ połączenia:", state.type);
            console.log("Nawiązano połączenie?", state.isConnected);
            if(state.isConnected === false) {
                alert('Brak połączenia z Internetem! Pobieranie testów z bazy danych!');
                this.getTestsFromDatabase();
            } else {
                if (this.props.manuallyUpdated !== undefined) {
                    console.log('Pobrano najnowszy stan testów z serwera WWW!');
                    alert('Pobrano najnowszy stan testów z serwera WWW!');
                    this.getTests();
                } else {
                    console.log('Nawiązano połączenie z siecią.');
                    this.downloadData();
                }
            }
        });
    }

    async downloadData() {
        const date = await AsyncStorage.getItem('date');
        if (getDate == date) {
            this.getTestsFromDatabase();
            console.log('Daty się zgadzają');
        } else {
            this.getTests();
            console.log('Daty się nie zgadzają');
        }
    }

    getTests = () => {
        let url = 'http://tgryl.pl/quiz/tests';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    result: data
                });
                db.transaction((tx => {
                    tx.executeSql(`DELETE FROM tests;`)
                    tx.executeSql(`DELETE FROM testQuestions;`);
                    data.map(item => {
                        let sql = `INSERT INTO tests (id,name,description,tags,level,numberOfTasks) VALUES (\'${item.id}\',\'${item.name}\',\'${item.description}\',\'${item.tags}\',\'${item.level}\',${item.numberOfTasks});`;
                        tx.executeSql(sql);
                    });
                }))
                this.getQuestionsData();
                AsyncStorage.setItem('date', getDate);
            })
            .catch((error) => {
                alert('Błąd podczas pobierania danych z sieci!');
                console.log('Błąd podczas pobierania danych z sieci!', error.message);
                this.getTestsFromDatabase();
            });
    };

    getTestsFromDatabase = () => {
        db.transaction((tx => {
            let sql = `SELECT * FROM tests;`;
            tx.executeSql(sql,[],(tx, results) => {
                let res = [];
                for (let i = 0; i < results.rows.length; i++) {
                    let row = results.rows.item(i);
                    res.push(row);
                }
                this.setState({
                    result: res
                })
            })
            this.getQuestionsFromDatabase();
        }));
    }

    getQuestionsData = () => {
        let url = 'http://tgryl.pl/quiz/test/';
        for (let i = 0; i < this.state.result.length; i++) {
            fetch(url + this.state.result[i].id)
                .then((data) => data.json())
                .then((d) => {
                    db.transaction((tx) => {
                        tx.executeSql(
                            'INSERT INTO testQuestions (id, name, description, level, tasks, tags) VALUES (?, ?, ?, ?, ?, ?);',
                            [d.id, d.name, d.description, JSON.stringify(d.level), JSON.stringify(d.tasks), JSON.stringify(d.tags)]
                        );
                    });
                })
                .catch((error) => {
                    alert('Błąd podczas pobierania danych szczegółowych testów!');
                    console.log('Błąd podczas pobierania danych szczegółowych testów!', error);
                    this.getQuestionsFromDatabase();
                });
        }
    };


    getQuestionsFromDatabase = () => {
        db.transaction((tx => {
            let sql = `SELECT * FROM testQuestions;`;
            tx.executeSql(sql,[],(tx, results) => {
                for (let i=0;i<results.rows.length; i++) {
                    let res = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let row = results.rows.item(i);
                        res.push(row);
                    }
                }
            })
        }));
    }

    goToScreen = (screenName, id, name) => {
        Navigation.push('MAIN_STACK', {
            component: {
                name: screenName,
                options: {
                    topBar: {
                        title: {
                            text: ((screenName === 'QuizScreen') ? name : screenName
                                    || (screenName === 'ResultScreen') ? 'Tabela wyników' : screenName),
                            fontSize: 14
                        }
                    }
                },
                passProps: {
                    nick: this.state.nick,
                    testId: id,
                    testName: name,
                }
            }
        });
    };

    setNickname = (nickname) => {
        console.log('Ustawiono nazwę użytkownika:',nickname);
        AsyncStorage.setItem('nick', nickname);
        this.setState({
            nick: nickname
        })
    }

    getNickname = async () => {
        let nickname = await AsyncStorage.getItem('nick');
        this.setState({
            nick: nickname
        })
    }


  render() {
      const showTasks = () => {
          if(this.state.result != undefined || this.state.result != null) {
              let quizList =  _.shuffle(this.state.result);
              return quizList.map((item) => {
                  return (
                      <TouchableOpacity key={item.id} style={styles.quizStyle}
                                        onPress={() => this.goToScreen('QuizScreen', item.id, item.name)}>
                          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.name}</Text>
                          <Text>{item.tags}</Text>
                          <Text>{item.description}</Text>
                      </TouchableOpacity>
                  )
              })
          }
      }

      if(this.state.result != undefined || this.state.result != null) {
          return (
              <View style={styles.container}>
                  <View>
                      <RegulationsScreen pagekey={"uniquekey"}/>
                  </View>
                  <ScrollView>
                      <View>
                          <Text style={{fontWeight: 'bold', marginLeft: 15, marginRight: 15, fontSize: 20}}>Wybierz swoją
                              nazwę użytkownika:</Text>
                          <TextInput
                              style={{
                                  backgroundColor: 'white',
                                  height: 40,
                                  borderColor: 'black',
                                  borderWidth: 1,
                                  marginTop: 10,
                                  marginRight: 15,
                                  marginLeft: 15
                              }}
                              onChangeText={(text) => this.setNickname(text)}
                          />
                          <Text style={{fontWeight: 'bold', marginLeft: 15, marginRight: 15, fontSize: 14}}>Twoja aktualna nazwa użytkownika: <Text style={{color: 'green'}}>{this.state.nick}</Text></Text>
                      </View>
                      {showTasks()}
                  </ScrollView>
                  <View style={styles.footerStyle}>
                      <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 5}}>Poznaj wyniki quizów!</Text>
                      <TouchableOpacity style={styles.buttonStyle}
                                        onPress={() => this.goToScreen('ResultScreen')}><Text>Sprawdź!</Text></TouchableOpacity>
                  </View>
              </View>
          );
      } else {
          return (
              <View style={{backgroundColor: '#FFFF99', flex: 1}}>
                  <Text>Proszę czekać... Trwa wczytywanie danych!</Text>
              </View>
          )
      }
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF99',
        justifyContent: 'center'
    },
    quizStyle: {
        padding: 20,
        backgroundColor: '#FFFF66',
        margin: 15,
        borderWidth: 1
    },
    footerStyle: {
        borderWidth: 1,
        alignItems: 'center',
    },
    buttonStyle: {
        marginTop: 10,
        marginBottom: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: 'orange',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        width: 200,
    }
});
