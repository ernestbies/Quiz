import React, { Component} from "react";
import {Modal, View, Text, TouchableOpacity, StyleSheet} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export default class RegulationsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }


    componentDidMount() {
        AsyncStorage.getItem('RegulationsKey', (err, result) => {
            if (err) {
            } else {
                if (result == null) {
                    this.setModalVisible(true);
                } else {
                    console.log('Result:', result);
                    //Wyświetlenie regulaminu aplikacji (tylko przy pierwszym uruchomieniu)
                    //this.setModalVisible(true);
                }
            }
        });

        AsyncStorage.setItem('RegulationsKey', JSON.stringify({"value":"true"}), (err,result) => {
            console.log("Error:", err,"Result: ", result);
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.titleContainer}>
                            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 20}}>Regulamin aplikacji</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.textStyle}>1. Podczas używania aplikacji 'Quiz' nie korzystaj z internetu.</Text>
                            <Text style={styles.textStyle}>2. Nie szukaj podpowiedzi, które pomogą Ci poprawnie rozwiązać quiz.</Text>
                            <Text style={styles.textStyle}>3. Nie oszukuj.</Text>
                            <Text style={styles.textStyle}>4. Baw się dobrze.</Text>
                        </View>
                        <View style={styles.exitContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            >
                                <View style={styles.exitButtonContainer}>
                                    <Text style={styles.exitButtonText}>Akceptuję</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FFFF00',
        flex:1,
        marginTop:70,
        marginBottom:40,
        marginLeft:20,
        marginRight:20,
        borderRadius:20,
        borderWidth:4,
        borderColor:'black'
    },
    textStyle: {
        fontSize: 15,
        marginLeft: 20,
        marginRight: 20
    },
    description:{
        color:'white',
        fontSize:15,
        marginRight:20,
        marginLeft:20
    },
    titleContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 20
    },
    descriptionContainer:{
        flex:6.5
    },
    exitContainer:{
        flex:2,
        justifyContent:'flex-start',
        alignItems:'center',
    },
    exitButtonContainer:{
        width:200,
        height:40,
        backgroundColor:'orange',
        borderRadius:10,
        justifyContent:'center',
        borderWidth: 2
    },
    exitButtonText:{
        color:'black',
        fontSize:20,
        textAlign:'center'
    }
});
