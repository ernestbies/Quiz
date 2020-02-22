import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Navigation} from 'react-native-navigation';
import SQLite from 'react-native-sqlite-storage';
const _ = require('lodash');

const db = SQLite.openDatabase({name: 'quiz_databasee.db', createFromLocation: '~www/quiz.db'});

export default class Drawer extends Component {
    randomId = '';
    randomName = '';

    componentDidMount() {
        this.getTestsFromDatabase();
    }

    goToScreen = (type) => {
        Navigation.mergeOptions('drawerId', {
            sideMenu: {
                left: {
                    visible: false
                }
            }
        })

        switch (type) {
            case 0:
                Navigation.push('MAIN_STACK', {
                    component: {
                        name: 'HomeScreen',
                        options: {
                            topBar: {
                                title: {
                                    text: 'Menu główne'
                                }
                            }
                        }
                    }
                });
                break;
            case 1:
                Navigation.push('MAIN_STACK', {
                    component: {
                        name: 'ResultScreen',
                        options: {
                            topBar: {
                                title: {
                                    text: 'Tabela wyników'
                                }
                            }
                        }
                    }
                });
                break;
            case 2:
                Navigation.push('MAIN_STACK', {
                    component: {
                        name: 'QuizScreen',
                        options: {
                            topBar: {
                                title: {
                                    text: this.randomName,
                                    fontSize: 12
                                }
                            }
                        },
                        passProps: {
                            testId: this.randomId,
                            testName: this.randomName
                        }
                    }
                });
            case 3:
                Navigation.push('MAIN_STACK',{
                    component: {
                        name: 'HomeScreen',
                        options: {
                            topBar: {
                                title: {
                                    text: 'Menu główne'
                                }
                            }
                        },
                        passProps: {
                            manuallyUpdated: true
                        }
                    }
                });
                break;
            default:
                Navigation.push('MAIN_STACK',{
                    component: {
                        name: 'HomeScreen',
                        options: {
                            topBar: {
                                title: {
                                    text: 'Menu główne'
                                }
                            }
                        }
                    }
                });
                break;
        }
    }

    getTestsFromDatabase = () => {
        db.transaction((tx => {
            let sql = `SELECT * FROM tests;`;
            tx.executeSql(sql,[],(tx, results) => {
                let res = [];
                for (let i = 0; i < results.rows.length; i++) {
                    let row = results.rows.item(i);
                    res.push(row);
                }
                res = _.shuffle(res);
                this.randomId = res[0].id;
                this.randomName = res[0].name
            })
        }));
    }

    randomQuiz = () => {
        console.log('Przenoszę do losowo wybranego testu... Wylosowano test o ID: ', this.randomId);
        Navigation.mergeOptions('drawerId', {
            sideMenu: {
                left: {
                    visible: false
                }
            }
        })

        Navigation.push('MAIN_STACK', {
            component: {
                name: 'QuizScreen',
                options: {
                    topBar: {
                        title: {
                            text: this.randomName
                        }
                    }
                },
                passProps: {
                    testId: this.randomId,
                    testName: this.randomName
                }
            }
        });
    }

    render() {
        return (
            <View style={styles.viewStyle}>
                <View style={styles.container}>
                    <Text style={{fontSize: 30}}>Quiz App</Text>
                    <Image style={{width: 200, height: 200}} source={require('../images/quiz_logo.png')} />
                    <Text style={{fontSize: 20}}><Text style={{fontWeight: 'bold', fontFamily:'Lato-Bold'}}>Autor:</Text> Ernest Bieś</Text>
                    <Text style={{fontSize: 15}}><Text style={{fontWeight: 'bold', fontFamily:'Raleway-Black'}}>Wersja aplikacji:</Text> 1.0</Text>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.goToScreen(0)}>
                        <Text style={styles.buttonText}>Menu główne</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.goToScreen(1)}>
                        <Text style={styles.buttonText}>Wyniki</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.randomQuiz()}>
                        <Text style={styles.buttonText}>Losowy test</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.goToScreen( 3)}>
                        <Text style={styles.buttonText}>Zaktualizuj testy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF99',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewStyle: {
        flex: 1,
    },
    buttonStyle: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor:'orange',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        width: 200,
    },
    buttonText: {
        fontSize: 20,
    }
});
