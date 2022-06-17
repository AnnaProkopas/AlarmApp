import * as React from 'react';
import { StyleSheet, Text, View, Switch, Button, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddAlarm } from './UIComponents';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from "expo-av";
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function App() {
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

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
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

class HomeScreen extends React.Component {

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
        alarmUrls: [
            { id: 0, url: "http://sc-blues.1.fm:8200" },
        ],
        customText: null,
        maxId: 0,
        maxCreatedAt: null,
        alarms: [
            { id: 0, time: new Date(), turnOn: true, createdAt: new Date(), urlId: 0 },
            { id: 1, time: new Date(), turnOn: true, createdAt: new Date(), urlId: 0 },
            { id: 2, time: new Date(), turnOn: true, createdAt: new Date(), urlId: 0 },
            { id: 3, time: new Date(), turnOn: true, createdAt: new Date(), urlId: 0 },
            { id: 4, time: new Date(), turnOn: true, createdAt: new Date(), urlId: 0 },
            { id: 5, time: new Date(), turnOn: true, createdAt: new Date(), urlId: 0 },
        ],
        currentSound: null,
    }

    createAlarm(newTime, createdAt) {
        if (!(newTime instanceof Date) || isNaN(newTime)) {
            throw 1;
        }
        return { id: this.state.maxId, time: newTime, turnOn: false, createdAt: createdAt };
    }

    componentDidUpdate() {
        if (this.props.route.params) {
            if (!this.state.alarms) {
                this.state.alarms = [];
            }
            if (this.state.maxCreatedAt !== this.props.route.params.createdAt) {
                this.state.alarms.push(this.createAlarm(this.props.route.params.newAlarmTime, this.props.route.params.createdAt));
                this.state.maxId += 1;
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

    runRadio = async () => {
        try {
            const currentTrackUrl = this.state.alarmUrls[0].url;
            const { sound } = await Audio.Sound.createAsync(
                { uri: currentTrackUrl },
                undefined,
                null,
                false
            );
            await sound.playAsync();

            this.state.currentSound = sound;
            this.setState(this.state);
        } catch (err) {
            console.error('Failed to start radio', err);
        }
    }

    render() {
        const IconButton = ({ title, onPress, icon }) => (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text>{title}</Text>
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
                <Button title='Run alarm' onPress={
                    () => {
                        this.runRadio();
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
                                            }
                                        }
                                    />
                                    <Text>{formatDateTime(val.time)}</Text>
                                    <IconButton title='Add Alarm' onPress={
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
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    button: {

    },
});
