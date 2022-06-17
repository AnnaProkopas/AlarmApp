import * as SQLite from 'expo-sqlite';
import { Alarm } from './Models';

const db = SQLite.openDatabase('alarm_app.db')

const columnId = 'id';
const columnTime = 'time';
const columnTurnOn = 'turn_on';
const columnRadio = 'radio';

function createTable() {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS alarms (${columnId} INTEGER PRIMARY KEY, ${columnTime} TEXT, ${columnTurnOn} BOOLEAN), ${columnRadio} INTEGER`
        )
    })
};

async function selectAlarmsList() {
    alarmList = [];
    await db.transaction(async tx => {
        const res1 = await tx.executeSql('SELECT * FROM alarms');
        res1._array.forEach(item => {
            alarm = new Alarm(item[columnId], null, item[columnTurnOn], item[columnRadio]);
            alarm.setTimeFormat(item[columnTime]);
            alarmList.push(alarm);
        });
    });
    return alarmList;
}

function insertAlarmItem(alarm: Alarm) {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO items (${columnId}, ${columnTime}, ${columnTurnOn}, ${columnRadio}) values (?, ?, ?, ?)`, [alarm.id, alarm.time, alarm.turnOn, alarm.radioId],
            (txObj, resultSet) => { },
            (txObj, error) => console.log('Error', error))
    });
}

function updateAlarmItem(alarm: Alarm) {
    db.transaction(tx => {
        tx.executeSql(`UPDATE items SET ${columnTime} = ?, ${columnTurnOn} = ?, ${columnRadio} = ? WHERE ${columnId} = ?`, [alarm.time, alarm.turnOn, alarm.radioId, alarm.id],
            (txObj, resultSet) => { },
            (txObj, error) => console.log('Error', error))
    });
}

function deleteAlarmItem(alarm: Alarm) {
    db.transaction(tx => {
        tx.executeSql(`DELETE FROM items where ${columnId} = ?`, [alarm.radioId],
            (txObj, resultSet) => { },
            (txObj, error) => console.log('Error', error))
    });
}

export { createTable, selectAlarmsList, insertAlarmItem, updateAlarmItem, deleteAlarmItem };