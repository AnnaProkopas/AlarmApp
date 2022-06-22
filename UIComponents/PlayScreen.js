import React, { Component, useState, useEffect, useRef,  } from 'react';
import { StyleSheet, Text, View, Switch, Button, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from "expo-av";
import { Radio, getRadioById } from '../Modules/Models';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { turnOffAlarmItem } from '../Modules/DbController';

function PlayScreen (props) {
    const [currentSound, setCurrentSound] = useState(null);
    const [soundState, setSoundState] = useState(null);
    const [radioName, setRadioName] = useState('');

    const playStream = async (radio: Radio) => {
        console.log('playStream');
        try {
            const currentTrackUrl = radio.url;
            const { sound } = await Audio.Sound.createAsync(
                { uri: currentTrackUrl },
                undefined,
                null,
                false
            );
            if (currentSound != null && soundState) {
                stopStream();
            }

            await sound.playAsync();
            setSoundState(true);

            setCurrentSound(sound);
            setRadioName(radio.name);
        } catch (err) {
            console.error('Failed to start radio', err);
        }
    };

    const stopStream = async () => {
        console.log('stopStream');
        try {
            await currentSound.pauseAsync();
            setSoundState(false);
        } catch (err) {
            console.error('Failed to pause radio', err);
        }
    };


    useEffect(() => {
        playStream(getRadioById(props.route.params.radioId));
        turnOffAlarmItem(props.route.params.alarmId);
    }, []);

    const IconButton = ({ onPress, icon }) => (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {icon}
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradient}>
            <Text style={styles.text}>{radioName}</Text>
            {
                soundState == null ?
                    <ActivityIndicator size="large" color="#000" />
                    : soundState ?
                <IconButton style={styles.button} onPress={
                    () => {
                        stopStream();
                        setSoundState(false);
                    }
                }
                    icon={<FontAwesome name="pause" size={50} color="black" />}
                />
                    :
                <IconButton style={styles.button}  onPress={
                    () => {
                        currentSound.playAsync();
                        setSoundState(true);
                    }
                }
                    icon={<FontAwesome name="play" size={50} color="black" />}
                />
            }
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
    },
    text: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: '800',
        textShadowColor: 'white',
        textShadowRadius: 2,
    }
});

export { PlayScreen };