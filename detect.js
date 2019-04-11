// var Gamecontroller = require('gamecontroller');

// var dev = Gamecontroller.getDevices();

// console.log(dev);

var HID = require('node-hid');
//console.log(HID.devices());


var hid = new HID.HID(3888, 263);
hid.on("data", function(data) {
    console.log('Inside on data');
    console.log(data);
    console.log( data[4])
});

hid.on("error", function(err) {
    console.log(err);
});
