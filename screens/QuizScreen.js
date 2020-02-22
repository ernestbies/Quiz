import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import SQLite from "react-native-sqlite-storage";
import CountDown from 'react-native-countdown-component';
import getDate from '../components/getDate';
import AsyncStorage from '@react-native-community/async-storage';
const _ = require('lodash');

const db = SQLite.openDatabase({name: 'quiz_databasee.db', createFromLocation: '~www/quiz.db'});

export default class QuizScreen extends Component {
  arr = [];
  points = 0;
  numOfTasks = 0;

  constructor(props){
    super(props);
    this.state = {
      index: 0,
      keys: [0, 1, 2, 3],
      tests: null,
      testsDetails: null,
      progressStatus: 0,
      timerId: 0,
      quizId: this.props.testId,
      timer: false,
      nick: null
    };

    this.onPress = this.onPress.bind(this);
  }

  async componentDidMount() {
    this.getNickname();
    this.getData();
    this.shuffleData();
    this.setTimer(true);
  }

  componentWillUnmount() {
    this.setTimer(false);
  }

  setTimer(value) {
    this.setState({
      timer: value
    })
  }

  getNickname = async () => {
    let nickname = await AsyncStorage.getItem('nick');
    this.setState({
      nick: nickname
    })
  }

  sendResult() {
    this.numOfTasks = this.state.tests.length;
    fetch('http://tgryl.pl/quiz/result', {
      method: 'POST',
      headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nick: this.state.nick,
        score: this.points,
        total: this.numOfTasks,
        type: this.props.testName,
        date: getDate
      })
    }).catch((error) => {
      alert('Błąd podczas wysyłania testów na serwer!');
    });
    console.log('Wysłano dane!');
  }

  getData(){
    db.transaction((tx) => {
      tx.executeSql('SELECT tasks FROM testQuestions WHERE id = ?',[this.state.quizId], (tx, results) => {
        let data = JSON.parse(results.rows.item(0).tasks)
        data = this.shuffleData(data);
        data.map((item)=>{
          item.answers = _.shuffle(item.answers);
        });
        this.setState({tests: data});
      });
    });
  }

  shuffleData(array) {
    return _.shuffle(array);
  }

  onPress(value) {
    if(this.state.timer === true) {
      this.setState({
        index: this.state.index + 1,
        timerId: this.state.timerId + 1
      });
      this.arr.push(value);
    }

    if ((this.state.index+1) === this.state.tests.length){
      this.setTimer(false);
    }
  }

  goToScreen = screenName => {
    if(this.arr.length != this.state.tests.length) {
      this.arr.push(0);
    }

    if(this.state.tests != undefined && this.state.tests != null) {
      for (let i = 0; i < this.state.tests.length; i++) {
        if (this.state.tests[i].answers[this.arr[i]].isCorrect === true) {
          this.points += 1;
        }
      }

      //Wysłanie danych na serwer
      this.sendResult();

      Navigation.push('MAIN_STACK', {
        component: {
          name: screenName,
          options: {
            topBar: {
              title: {
                text: 'Moje wyniki'
              }
            }
          },
          passProps: {
            myAnswers: this.arr,
            taskList: this.state.tests,
            nickName: this.props.nick,
            points: this.points,
            numberOfTasks: this.state.tests.length,
            type: this.props.testName,
            date: getDate
          }
        }
      });
    } else {
      console.log('Pobieram dane...');
    }
  };

  render() {
    if(this.state.tests === null || this.state.tests === undefined) {
      return (
          <View style={styles.container}>
            <Text>Proszę czekać... Trwa wczytywanie danych!</Text>
          </View>
      )
    }

    if((this.state.index < this.state.tests.length)){
      return (
          <View style={styles.container}>
            <ScrollView>
            <View>
              <Text style={styles.questionStyle}>Pytanie {this.state.index+1} z {this.state.tests.length}</Text>
              <Text style={styles.questionStyle2}>Czas na udzielenie odpowiedzi:</Text>
              <CountDown
                  id={this.state.timerId.toString()}
                  until={this.state.tests[this.state.index].duration}
                  onFinish={() => {this.onPress(0)}}
                  size={20}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: 'minut', s: 'sekund'}}
                  running={this.state.timer}
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionTitle}>{this.state.tests[this.state.index].question}</Text>
            </View>
            <View style={styles.answersContainer}>
              <TouchableOpacity key={this.state.keys[0]} onPress={() => this.onPress(this.state.keys[0])} style={styles.buttonStyle}><Text>{this.state.tests[this.state.index].answers[0].content}</Text></TouchableOpacity>
              <TouchableOpacity key={this.state.keys[1]} onPress={() => this.onPress(this.state.keys[1])} style={styles.buttonStyle}><Text>{this.state.tests[this.state.index].answers[1].content}</Text></TouchableOpacity>
              <TouchableOpacity key={this.state.keys[2]} onPress={() => this.onPress(this.state.keys[2])} style={styles.buttonStyle}><Text>{this.state.tests[this.state.index].answers[2].content}</Text></TouchableOpacity>
              {
                this.state.tests[this.state.index].answers.length > 3 ? <TouchableOpacity key={this.state.keys[3]} onPress={() => this.onPress(this.state.keys[3])} style={styles.buttonStyle}><Text>{this.state.tests[this.state.index].answers[3].content}</Text></TouchableOpacity> : <TouchableOpacity></TouchableOpacity>
              }
            </View>
            </ScrollView>
          </View>
      )
    }

    if((this.state.index === this.state.tests.length)){
      this.goToScreen('MyResultScreen');
      return (
          <View style={styles.container}>
            <Text>Proszę czekać... Trwa wczytywanie danych!</Text>
          </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF99'
  },
  questionContainer: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10
  },
  answersContainer: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFFF66',
    borderWidth: 1,
    alignItems: 'center'
  },
  buttonStyle: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'orange',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    width: 200,
  },
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10
  },
  questionStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  questionStyle2: {
    fontSize: 18,
    marginLeft: 10
  },
  questionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10
  },
  questionDesc: {
    fontSize: 15
  },
  progressBar: {
    height: 15,
    width: '90%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 10,
  },
  inner:{
    width: "90%",
    height: 12,
    borderRadius: 4,
    backgroundColor:"red",
  },
  label:{
    fontSize: 12,
    color: "black",
    position: "absolute",
    alignSelf: "center",
  }
});
