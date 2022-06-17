import { useState } from 'react';
import { View, Button } from "react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker'
import { radioListForDropDown } from '../Modules/Models'


function AddAlarm(props) {
    const [date, setDate] = useState(new Date());
    const [radioId, setRadioId] = useState(0);

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
            <DropDownPicker
                items={radioListForDropDown()}
                defaultIndex={0}
                containerStyle={{ height: 40 }}
                onChangeItem={item => setRadioId(item.value)}
            />
            <Button
                title='Submit'
                onPress={() => {
                    props.navigation.navigate('Home', { newAlarmTime: date, createdAt: new Date(), radioId: radioId });
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