import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView, RefreshControl} from 'react-native';

export default class ResultScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            results: null
        }
    }

    componentDidMount() {
        this.getResults();
    }

    getResults = () => {
        fetch('http://tgryl.pl/quiz/results')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    results: data
                });
            })
            .catch(error => console.log(error));
    };

    keyExtractor = (item) => item.id.toString();


    onRefresh = () => {
        this.getResults();
        this.setState({refreshing: false});
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.results}
                    keyExtractor={this.keyExtractor}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    renderItem={({item}) => {
                        return (
                            <ScrollView>
                                <View key={item.key} style={styles.containerRes}>
                                    <Text style={{fontWeight: 'bold'}}>Nick: <Text style={{fontWeight: 'normal'}}>{item.nick}</Text></Text>
                                    <Text style={{fontWeight: 'bold'}}>Score: <Text style={{fontWeight: 'normal'}}>{item.score}</Text></Text>
                                    <Text style={{fontWeight: 'bold'}}>Total: <Text style={{fontWeight: 'normal'}}>{item.total}</Text></Text>
                                    <Text style={{fontWeight: 'bold'}}>Type: <Text style={{fontWeight: 'normal'}}>{item.type}</Text></Text>
                                    <Text style={{fontWeight: 'bold'}}>Date: <Text style={{fontWeight: 'normal'}}>{item.date}</Text></Text>
                                </View>
                            </ScrollView>
                        );
                    }}
                />
            </View>
        );
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
