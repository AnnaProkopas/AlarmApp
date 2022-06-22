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
    0: new Radio(0, "https://us3.internet-radio.com/proxy/topblues?mp=/stream", 'TOPBLUES'),
    1: new Radio(1, "https://us4.internet-radio.com/proxy/douglassinclair?mp=/stream", 'Classic Rock Florida HD Radio'),
    2: new Radio(2, "https://cast.magicstreams.gr:9111/stream/1/", 'Psyndora Psytrance'),
    3: new Radio(3, "https://uk3.internet-radio.com/proxy/majesticjukebox?mp=/live", 'Majestic Jukebox Radio'),
    4: new Radio(4, "https://uk7.internet-radio.com/proxy/movedahouse?mp=/stream", 'Techno '),
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