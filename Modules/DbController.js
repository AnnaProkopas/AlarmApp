import * as SQLite from 'expo-sqlite';
import { Alarm } from './Models';


const tableName = 'alarms';
const columnId = 'id';
const columnTime = 'time';
const columnTurnOn = 'turn_on';
const columnRadio = 'radio';
const columnPushId = 'push_id';

const db = SQLite.openDatabase('alarm_app.db');
db.transaction(tx => tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnId} INTEGER PRIMARY KEY NOT NULL, ${columnTime} STRING, ${columnTurnOn} BOOLEAN, ${columnRadio} INTEGER, ${columnPushId} STRING)`));

async function createTable() {
    console.log('create_table');
};

function selectAlarmsList() {
    console.log('select');
    return new Promise((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(`SELECT * FROM ${tableName}`, [], (_, { rows }) => {
                    let alarmList = [];
                    rows._array.forEach(item => {
                        let alarm = new Alarm(item[columnId], null, item[columnTurnOn] == 1, item[columnRadio]);
                        alarm.setTimeFormat(item[columnTime]);
                        if (item[columnPushId]) {
                            alarm.pushId = item[columnPushId];
                        }
                        alarmList.push(alarm);
                    });
                    console.log('success len ' + alarmList.length);
                    resolve( alarmList );
                }, (_, error) => console.log('Error select'));
            }, null, null);
    });
}

function insertAlarmItem(alarm: Alarm) {
    console.log('insert #' + alarm.id);
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO ${tableName} (${columnId}, ${columnTime}, ${columnTurnOn}, ${columnRadio}, ${columnPushId}) values (${alarm.id}, '${alarm.time_format}', ${alarm.turnOn ? 1 : 0}, ${alarm.radioId}, '${alarm.pushId ? alarm.pushId : ''}')`,
            undefined,
            (txObj, resultSet) => {
                console.log('success insert');
            },
            (txObj, error) => {
                console.log('Error insert');
                console.log(error);
            });
    });
}

function updateAlarmItem(alarm: Alarm) {
    console.log('update #' + alarm.id);
    db.transaction(tx => {
        tx.executeSql(`INSERT OR REPLACE INTO ${tableName} (${columnId}, ${columnTime}, ${columnTurnOn}, ${columnRadio}, ${columnPushId}) values (${alarm.id}, '${alarm.time_format}', ${alarm.turnOn ? 1 : 0}, ${alarm.radioId}, '${alarm.pushId ? alarm.pushId : ''}')`,
            undefined,
            (txObj, resultSet) => console.log('success upsert'),
            (txObj, error) => console.log('Error update'))
    });
}

function turnOffAlarmItem(alarmId: int) {
    console.log('turn off #' + alarmId);
    db.transaction(tx => {
        tx.executeSql(`UPDATE ${tableName} SET ${columnTurnOn} = 0 WHERE ${columnId} = ${alarmId};`,
            undefined,
            (txObj, resultSet) => console.log('success turn off '),
            (txObj, error) => console.log('Error update'))
    });
}

function deleteAlarmItem(alarm: Alarm) {
    console.log('delete #' + alarm.id);
    db.transaction(tx => {
        tx.executeSql(`DELETE FROM ${tableName} WHERE ${columnId} = ${alarm.id};`,
            undefined,
            (txObj, resultSet) => {
                console.log('success delete');
                selectAlarmsList();
            },
            (txObj, error) => console.log('Error delete'))
    });
}

export { createTable, selectAlarmsList, insertAlarmItem, updateAlarmItem, deleteAlarmItem, turnOffAlarmItem };