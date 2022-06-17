import { useState } from 'react';
import { View, Button } from "react-native";
//import TimePicker from 'react-time-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


function AddAlarm(props) {
    const [date, setDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true
        })
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };


    return (
        <View>
            <Button onPress={showTimepicker} title="Show time picker!" />
            <Button
                title='Submit'
                onPress={() => {
                    props.navigation.navigate('Home', { newAlarmTime: date, createdAt: new Date() });
                }}
            />
            <Button
                title='Cancel'
                onPress={() => {
                    props.navigation.goBack();
                }}
            />
        </View>
        );
}

export { AddAlarm };