class Alarm {
    id;
    time;
    time_format;
    turnOn
    radioId;

    constructor(id: int, time: Date, turnOn: bool, radioId: int) {
        this.id = id;
        this.time = time;
        if (this.time != null) {
            this.time_format = this.formatTime();
        }
        this.turnOn = turnOn;
        this.radioId = radioId;
    }

    setTimeFormat(time_format) {
        this.time_format = time_format;
        this.time = Date.parse('2021.01.01 ' + time_format);
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
    1: new Radio(0, "http://sc-classrock.1.fm:8200", 'Classic Rock'),
    2: new Radio(0, "http://sc-psytrance.1.fm:8200/", 'Bom Psytrance'),
};

function getRadioById(id) {
    return radioList[id] || null;
}

function radioListForDropDown() {
    let dropdown = [];
    for (i = 0; i < radioList.length; i++) {
        dropdown.push({ label: radioList[i].name, value: radioList[i].id });
    }
    return dropdown;
}

export { Alarm, getRadioById, Radio, radioListForDropDown };