import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert} from 'react-native';
import {Card} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';

class Reservation extends Component {
    constructor(props){
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table'
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK ?',
            'Number of Guests: ' + this.state.guests + '\nSmoking? '+ this.state.smoking + '\nDate and Time: ' + this.state.date,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'Ok',
                    onPress: () => this.toggleModal()
                }
            ],
            {cancelable: false}
        )
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''
        });
    }

    render() {
        return(
            <ScrollView>
                <Animatable.View animation = "zoomInDown" duration = {2000} delay = {1000}>
                <View style ={style.formRow}>
                    <Text style={style.formLabel}>Number of Guests</Text>
                    <Picker
                        style={style.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}
                    >
                        <Picker.Item label='1' value='1'/>
                        <Picker.Item label='2' value='2'/>
                        <Picker.Item label='3' value='3'/>
                        <Picker.Item label='4' value='4'/>
                        <Picker.Item label='5' value='5'/>
                        <Picker.Item label='6' value='6'/>
                    </Picker>
                </View>
                <View style={style.formRow}>
                    <Text style={style.formLabel}>Smoking/Non-Smoking ?</Text>
                    <Switch
                        style={style.formItem}
                        value={this.state.smoking}
                        trackColor='#512DA8'
                        onValueChange={(value) => this.setState({smoking: value})}
                    >
                    </Switch>
                </View>
                <View style={style.formRow}>
                    <Text style={style.formLabel}>Date and Time</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format=''
                        mode='datetime'
                        placeholder= 'select date and time'
                        minDate='2017-01-01'
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                        />
                </View>
                <View style={style.formRow}>
                    <Button
                        title='Reserve'
                        color='#512DA8'
                        onPress={() => this.handleReservation()}
                        accessibilityLabel='bla bla'
                        />
                </View>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal(); this.resetForm()}}
                    onRequestClose={() => {this.toggleModal(); this.resetForm()}}
                    >
                        <View style={style.modal}>
                            <Text style={style.modalTitle}>Your Reservation</Text>
                            <Text style={style.modalText}>Number of Guests: {this.state.guests}</Text>
                            <Text style={style.modalText}>Smoking ? : {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style={style.modalText}>Date and Time : {this.state.date}</Text>
                            <Button
                                onPress={() => {this.toggleModal(); this.resetForm()}}
                                color='#512DA8'
                                title='Close'
                            />
                        </View>
                </Modal>
                </Animatable.View>
            </ScrollView>
        );
    }
}

const style = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem:{
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10 
    }
})

export default Reservation;