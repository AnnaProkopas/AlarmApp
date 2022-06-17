import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, Button, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddAlarm } from './UIComponents';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from "expo-av";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alarm, getRadioById, Radio } from './Modules/Models';
import { insertAlarmItem } from './Modules/DbController';

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener;

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddAlarm" component={AddAlarm} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function formatDateTime(date) {
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    return [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
    ].join(':');
}

async function schedulePushNotification(alarm) {
    const radio = getRadioById(alarm.radioId);
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Alarm time!",
            body: `Click to listen stream of ${radio.name}`,
            data: { radioId: radio.id },
        },
        trigger: {
            hour: time.getHours(),
            minute: time.getMinutes(),
        },
    });
    return identifier;
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

async function cancelScheduledPushNotification(identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}


class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state.maxId = 0;
        for (let i = 0; i < this.state.alarms.length; i++) {
            if (this.state.maxId <= this.state.alarms[i].id) {
                this.state.maxId = this.state.alarms[i].id + 1;
            }
        }
    }

    state = {
        maxId: 0,
        maxCreatedAt: null, 
        alarms: [
            new Alarm(0, new Date(), true, 0),
        ],
    }

    createAlarm(newTime, radioId) {
        if (!(newTime instanceof Date) || isNaN(newTime)) {
            throw 1;
        }
        maxId = this.state.maxId;
        this.setState({ maxId: maxId + 1 });
        return new Alarm(maxId, newTime, true, radioId);
    }

    componentDidUpdate() {
        if (this.props.route.params) {
            if (!this.state.alarms) {
                this.state.alarms = [];
            }
            if (this.state.maxCreatedAt !== this.props.route.params.createdAt) {
                this.state.alarms.push(this.createAlarm(this.props.route.params.newAlarmTime, this.props.route.params.radioId));
                insertAlarmItem()
                this.state.maxCreatedAt = this.props.route.params.createdAt;
                this.state.alarms.sort(function (a, b) {
                    if (a.time > b.time) {
                        return 1;
                    }
                    if (a.time < b.time) {
                        return -1;
                    }
                    return 0;
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
                        this.props.navigation.navigate('AddAlarm', ({ title: 'FIRST' }));
                    }
                } />
                <ScrollView>
                    {
                        this.state.alarms.map(
                            (val, i) => (
                                <View key={val.id}>
                                    <Switch
                                        value={val.turnOn}
                                        onValueChange={
                                            () => {
                                                this.state.alarms[i].turnOn = !val.turnOn;
                                                this.setState(this.state);
                                                if (!val.turnOn) {
                                                    schedulePushNotification(val.time).then(identifier => {
                                                        this.state.alarms[i].identifier = identifier;
                                                        this.setState(this.state);
                                                    });
                                                } else if (val.identifier) {
                                                    cancelScheduledPushNotification(val.identifier).then(() => {
                                                        this.state.alarms[i].identifier = null;
                                                        this.setState(this.state);
                                                    });
                                                }
                                            }
                                        }
                                    />
                                    <Text>{formatDateTime(val.time)}</Text>
                                    <IconButton onPress={
                                        () => {
                                            this.state.alarms.splice(i, 1);
                                            this.setState(this.state);
                                        }
                                    }
                                        icon={<FontAwesome name="trash" size={24} color="grey" />}
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
        alignItems: 'baseline',
        justifyContent: 'center',
    },
    button: {

    },
});
