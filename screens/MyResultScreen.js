import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import img from '../images/winner.png';
import AsyncStorage from '@react-native-community/async-storage';

export default class MyResultScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            nick: null
        }
    }

    componentDidMount() {
        this.getNickname();
    }

    getNickname = async () => {
        let nickname = await AsyncStorage.getItem('nick');
        this.setState({
            nick: nickname
        })
    }

    render() {
        if (this.props.myAnswers !== undefined) {
            const generateResult = (param) => {
                return param.map((item, index) => {
                    let i = 0;
                    while ((i < 4) && !(item.answers[i].isCorrect)) {
                        i++;
                    };

                    return (
                        <View key={index} style={styles.containerRes}>
                            <Text style={{fontWeight: 'bold'}}>{item.question}</Text>
                            <Text>Prawidłowa odpowiedź: <Text
                                style={{fontWeight: 'bold', color: 'green'}}>{item.answers[i].content}</Text></Text>
                            <Text>Twoja odpowiedź: <Text
                                style={{fontWeight: 'bold'}}>{item.answers[this.props.myAnswers[index]].content}</Text></Text>
                        </View>
                    )
                });
            };

            return (
                <ScrollView style={styles.container}>
                    <View style={{alignItems:'center'}}>
                        <Image style={{width: 150, height: 150}} source={img}/>
                        <Text style={{fontSize: 18}}>Gratulacje <Text style={{fontWeight: 'bold'}}>{this.state.nick}</Text>, ukończyłeś quiz!</Text>
                        <Text style={{fontSize: 16}}>Uzyskałeś <Text style={{fontWeight: 'bold'}}>{this.props.points}/{this.props.numberOfTasks}</Text> punktów!</Text>
                        <Text style={{fontSize: 16}}>Quiz: <Text style={{fontWeight: 'bold'}}>{this.props.type}</Text></Text>
                        <Text style={{fontSize: 16}}>Data ukończenia quizu: <Text style={{fontWeight: 'bold'}}>{this.props.date}</Text></Text>
                        <Text style={{fontSize: 14}}>Oto lista odpowiedzi, które udzieliłeś podczas testu:</Text>
                    </View>
                    {generateResult(this.props.taskList)}
                </ScrollView>
            );
        } else {
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
    containerRes: {
        padding: 10,
        backgroundColor: '#FFFF66',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'black'
    }
});
