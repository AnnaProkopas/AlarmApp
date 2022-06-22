import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, Button, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alarm, getRadioById, Radio } from '../Modules/Models';
import { insertAlarmItem, updateAlarmItem, selectAlarmsList, createTable, deleteAlarmItem } from '../Modules/DbController';


async function schedulePushNotification(alarm: Alarm) {
    console.log('async shedule #' + alarm.id + ' time ' + alarm.time_format);
    const radio = getRadioById(alarm.radioId);
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Alarm time!",
            sound: "default",
            body: `Click to listen stream of ${radio.name}`,
            data: {
                radioId: radio.id,
                alarmId: alarm.id,
            },
        },
        trigger: {
            hour: alarm.time.getHours(),
            minute: alarm.time.getMinutes(),
            repeats: true,
        },
    });
    return identifier;
}

async function cancelScheduledPushNotification(identifier) {
    console.log('async cancel # ' + identifier);
    await Notifications.cancelScheduledNotificationAsync(identifier);
}


class HomeScreen extends Component {
    state = {
        maxId: 0,
        alarms: [],
    }

    constructor(props) {
        super(props);
        createTable().then(() => {
            this.updateAlarmList();
        });
    }

    updateAlarmList() {
        selectAlarmsList().then(list => {
            console.log('set list');
            console.log(list);
            this.setState({ alarms: list });
            let maxId = this.state.maxId;
            list.forEach(item => {
                if (maxId <= item.id) {
                    maxId = item.id + 1;
                }
            })
            this.setState({ maxId: maxId });
            console.log('select alarms done length ' + list.length);
            console.log('max id ' + this.state.maxId);
        });
    }

    createAlarm(newTime, radioId) {
        if (!(newTime instanceof Date) || isNaN(newTime)) {
            throw 1;
        }
        let maxId = this.state.maxId;
        this.state.maxId += 1
        this.setState(this.state);
        console.log('max id ' + this.state.maxId);
        return new Alarm(maxId, newTime, true, radioId);
    }

    componentDidMount() {
        this.updateAlarmList();/**
        for (let i = 0; i < this.state.alarms.length; i++) {
            if (this.state.maxId <= this.state.alarms[i].id) {
                this.state.maxId = this.state.alarms[i].id + 1;
            }
        }
        console.log('max id ' + this.state.maxId);*/
    }

    componentDidUpdate() {
        if (this.props.route.params) {
            if (!this.state.alarms) {
                this.state.alarms = [];
            }
            if (this.state.maxId == this.props.route.params.maxId) {
                const alarm = this.createAlarm(this.props.route.params.newAlarmTime, this.props.route.params.radioId);
                console.log('new alarm id ' + alarm.id);
                this.state.alarms.push(alarm);
                insertAlarmItem(alarm);
                schedulePushNotification(alarm).then(identifier => {
                    alarm.pushId = identifier;
                    updateAlarmItem(alarm);
                    for (let i = 0; i < this.state.alarms.length; i++) {
                        if (this.state.alarms[i].id == alarm.id) {
                            this.state.alarms[i] = alarm;
                            break;
                        }
                    }
                    this.setState(this.state);
                });
                this.setState(this.state);
            }
        }
    }

    render() {
        const IconButton = ({ onPress, icon }) => (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                {icon}
            </TouchableOpacity>
        );

        return (
            <View style={styles.container}>
                <Button title='Add Alarm' onPress={
                    () => {
                        this.props.navigation.navigate('AddAlarm', ({ maxId: this.state.maxId }));
                    }
                } />
                <ScrollView>
                    {
                        this.state.alarms.map(
                            (val, i) => (
                                <View key={val.id} style={styles.view_item}>
                                    <IconButton onPress={
                                        () => {
                                            deleteAlarmItem(val);
                                            this.state.alarms.splice(i, 1);
                                            this.setState(this.state);
                                        }
                                    }
                                        icon={<FontAwesome name="trash" size={24} color="grey" />}
                                    />
                                    <Text>{val.time_format}</Text>
                                    <Switch
                                        value={val.turnOn}
                                        onValueChange={
                                            () => {
                                                this.state.alarms[i].turnOn = !val.turnOn;
                                                this.setState(this.state);
                                                if (val.turnOn) {
                                                    schedulePushNotification(val).then(identifier => {
                                                        this.state.alarms[i].pushId = identifier;
                                                        updateAlarmItem(this.state.alarms[i]);
                                                        this.setState(this.state);
                                                        console.log('shedule #' + val.id + ' time ' + val.time_format);
                                                    });
                                                } else if (val.pushId) {
                                                    cancelScheduledPushNotification(val.pushId).then(() => {
                                                        this.state.alarms[i].pushId = null;
                                                        updateAlarmItem(this.state.alarms[i]);
                                                        this.setState(this.state);
                                                        console.log('cancel #' + val.id + ' time ' + val.time_format)
                                                    });
                                                }
                                            }
                                        }
                                    />
                                </View>
                            )
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: 10,
    },
    view_item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {

    },
});

export { HomeScreen };