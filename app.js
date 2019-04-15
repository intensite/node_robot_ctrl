const Gamecontroller = require('gamecontroller');
const ctrl = new Gamecontroller('jesstech');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const _ = require('lodash')


const port = new SerialPort('COM8', {
    baudRate: 9600
})

const parser = port.pipe(new Readline({ delimiter: '\n' }))


// The open event is always emitted
port.on('open', function () {
    // open logic
    console.log("Port was opened...")
        
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data:', data.toString());
})

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message)
})






ctrl.connect(function () {
    console.log('Game On!');
});

ctrl.on('1:press', function () {
    console.log('1 was pressed');
});

ctrl.on('1:release', function () {
    console.log('1 was released sending G28 $ G91');
    port.write('G28\r')
    port.write('G91\r')
});
ctrl.on('3:press', function () {
    console.log('3 was pressed');
});

ctrl.on('3:release', function () {
    console.log('3 was released');
    port.write('M114\r')
});

ctrl.on('Start:release', function () {
    console.log('Start was released');
    port.write('M17\r')
});
ctrl.on('Select:release', function () {
    console.log('Start was released');
    port.write('M18\r')
});


function moveX(o) {
    console.log(o);
    if(o.x > 128) {
        port.write("G1 X1 F10\r")
    } 
    if(o.x < 128) {
        port.write("G1 X-1 F10\r")
    }
}
function moveY(o) {
    console.log(o);
    if(o.y > 128) {
        port.write("G1 Y10 F20\r")
    } 
    if(o.y < 128) {
        port.write("G1 Y-10 F20\r")
    }
}
function moveZ(o) {
    console.log(o);
    if(o.y < 128) {
        port.write("G1 Z10 F20\r")
    } 
    if(o.y > 128) {
        port.write("G1 Z-10 F20\r")
    }
}
var debounceMoveX = _.throttle(moveX, 100, {
    'leading': true,
    'trailing': false}
    );
var debounceMoveY = _.throttle(moveY, 300, {
    'leading': true,
    'trailing': false}
    );
var debounceMoveZ = _.throttle(moveZ, 300, {
    'leading': true,
    'trailing': false}
    );

ctrl.on('JOYL:move', function(o) {
    // debounceMoveX(o);
    moveX(o);
    debounceMoveY(o);
    // console.log(o);
});


ctrl.on('JOYR:move', function (o) {
    console.log(o);
    debounceMoveZ(o);
});


ctrl.on('error', function () {
    console.log('Controller could not be found');
});

ctrl.on('close', function () {
    console.log('Closing the controller, nothing else to do.');
});

// To get the full parsed HID data stream, you can run

// ctrl.on('data', function(data) {
//     console.log(data);
// });

