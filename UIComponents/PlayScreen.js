import React, { Component, useState, useEffect, useRef } from 'react';
import { Audio } from "expo-av";
import { Radio } from './Modules/Models';


function PlayScreen () {
    const [currentSound, setCurrentSound] = useState(null);

    const playStream = async (radio: Radio) => {
        try {
            const currentTrackUrl = radio.url;
            const { sound } = await Audio.Sound.createAsync(
                { uri: currentTrackUrl },
                undefined,
                null,
                false
            );
            await sound.playAsync();

            setCurrentSound(sound);
        } catch (err) {
            console.error('Failed to start radio', err);
        }
    };
    const stopStream = async () => {
        try {
            await sound.playAsync();
        } catch (err) {
            console.error('Failed to start radio', err);
        }
    };

    playStream();

    const IconButton = ({ onPress, icon }) => (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {icon}
        </TouchableOpacity>
    );

    return (
        <View>
            <IconButton onPress={
                () => {
                        
                }
            }
                icon={<FontAwesome name="stop" size={50} color="grey" />}
            />
        </View>
    );
};

export { PlayScreen };