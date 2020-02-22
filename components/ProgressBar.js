import React, {Component} from 'react';
import {StyleSheet, View, Animated} from 'react-native';

export default class ProgressBar extends Component {
    anim = new Animated.Value(0);
    _isMounted = false;

    constructor(){
        super();
        this.state = {
            progressStatus: 0,
            data: null
        }
    }

    componentDidMount(){
        this.onAnimate();
        console.log('Progress bar mounted');
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onAnimate = () =>{
        this.anim.addListener(({value})=> {
            this.setState({progressStatus: parseInt(value,10)});
        });
        Animated.timing(this.anim,{
            toValue: 100,
            duration: this.props.duration,
        }).start();
    }

    render() {
        return (
            <View style={styles.progressBar}>
                <Animated.View
                    style={[
                        styles.inner,{width: 100-this.state.progressStatus +"%"},
                    ]}
                />
                <Animated.Text key={this.props.duration} style={styles.label}>
                    {100-this.state.progressStatus }% Czas na odpowiedź: {this.props.duration/1000} sekund
                </Animated.Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
