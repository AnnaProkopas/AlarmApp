import { useState } from 'react';
import { StyleSheet, View, Button } from "react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker'
import { radioListForDropDown } from '../Modules/Models'


function AddAlarm(props) {
    const [date, setDate] = useState(new Date());
    const [radioId, setRadioId] = useState(0);
    const [open, setOpen] = useState(false);

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
        <View style={styles.container}>
            <Button onPress={showTimepicker} title="Show time picker!" />
            <DropDownPicker
                open={open}
                value={radioId}
                items={radioListForDropDown()}
                setOpen={setOpen}
                setValue={setRadioId}
            />
            <Button
                title='Submit'
                onPress={() => {
                    props.navigation.navigate('Home', { newAlarmTime: date, radioId: radioId, maxId: props.route.params.maxId });
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 10,
    },
    button: {

    },
});

export { AddAlarm };