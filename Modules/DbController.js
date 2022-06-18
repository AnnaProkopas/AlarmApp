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
//console.log(db);

async function createTable() {
    console.log('create_table');
};

function selectAlarmsList() {
    console.log('select');
    return new Promise((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(`SELECT * FROM ${tableName}`, [], (_, { rows }) => {
                    console.log(rows);
                    alarmList = [];
                    rows._array.forEach(item => {
                        let alarm = new Alarm(item[columnId], null, item[columnTurnOn], item[columnRadio]);
                        alarm.setTimeFormat(item[columnTime]);
                        if (item[columnPushId]) {
                            alarm.pushId = item[columnPushId];
                        }
                        alarmList.push(alarm);
                    });
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
                console.log('success');
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
        tx.executeSql(`UPDATE ${tableName} SET ${columnTime} = ?, ${columnTurnOn} = ?, ${columnRadio} = ?, ${columnPushId} = ? WHERE ${columnId} = ?`,
            [alarm.time_format, (alarm.turnOn ? 1 : 0), alarm.radioId, alarm.pushId, alarm.id],
            (txObj, resultSet) => console.log('success'),
            (txObj, error) => console.log('Error update'))
    });
}

function deleteAlarmItem(alarm: Alarm) {
    console.log('delete #' + alarm.id);
    db.transaction(tx => {
        tx.executeSql(`DELETE FROM ${tableName} where ${columnId} = ?`,
            [alarm.radioId],
            (txObj, resultSet) => console.log('success'),
            (txObj, error) => console.log('Error delete'))
    });
}

export { createTable, selectAlarmsList, insertAlarmItem, updateAlarmItem, deleteAlarmItem };