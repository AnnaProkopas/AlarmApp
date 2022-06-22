class Alarm {
    id;
    time;
    time_format;
    turnOn
    radioId;
    pushId;

    constructor(id: int, time: Date, turnOn: bool, radioId: int) {
        this.id = id;
        this.time = time;
        if (this.time != null) {
            this.time_format = this.formatTime();
        }
        this.turnOn = turnOn;
        this.radioId = radioId;
        this.pushId = null;
    }

    setTimeFormat(time_format) {
        let date = new Date('2021-01-01T' + time_format + ':00');
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        this.time = new Date(date.getTime() - userTimezoneOffset);

        this.time_format = time_format;
    }

    formatTime() {
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        return [
            padTo2Digits(this.time.getHours()),
            padTo2Digits(this.time.getMinutes()),
        ].join(':');
    }
}


class Radio {
    id;
    url;
    name;

    constructor(id, url, name) {
        this.id = id;
        this.url = url;
        this.name = name
    }
}

const radioList = {
    0: new Radio(0, "http://sc-blues.1.fm:8200", 'Blues'),
    1: new Radio(1, "http://sc-classrock.1.fm:8200", 'Classic Rock'),
    2: new Radio(2, "http://sc-psytrance.1.fm:8200/", 'Bom Psytrance'),
};

function getRadioById(id) {
    return radioList[id] || null;
}

function radioListForDropDown() {
    let dropdown = [];
    for (var prop in radioList) {
        dropdown.push({ label: radioList[prop].name, value: radioList[prop].id });
    }
    return dropdown;
}

export { Alarm, getRadioById, Radio, radioListForDropDown };