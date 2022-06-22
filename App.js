import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, Button, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddAlarm, PlayScreen, HomeScreen } from './UIComponents';
import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alarm, getRadioById, Radio } from './Modules/Models';
import { insertAlarmItem, updateAlarmItem, selectAlarmsList, createTable, deleteAlarmItem } from './Modules/DbController';
import { navigationRef } from './Modules/RootNavigation';
import { useNotifications } from './Modules/Notification';

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const App = ({ component }) => {
    useNotifications();

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddAlarm" component={AddAlarm} />
                <Stack.Screen name="PlayScreen" component={PlayScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;