const Gamecontroller = require('gamecontroller');
const ctrl = new Gamecontroller('jesstech');  // Model of the controller (from ./node_modules/gamecontroller/vendors.js)
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const COM_PORT = "COM8";
const BAUD_RATE = 115200;
const STEPS_DISTANCE = 1;       // Distance of each steps (in mm)
const STEPS_SPEED = 30;         // Speed of the stepper moves (in mm/s)
const MOVE_FREQ = 50;           // Frequency (in ms) at which the commands are sent to the robot


// Store Joystick coordinates
// Initialized to 128 => center position
var xyAxis = {
    x:128, y:128
};
var zAxis = {
    x:128, y:128
};

// Setup COM port 
const port = new SerialPort(COM_PORT, { baudRate: BAUD_RATE });
const parser = port.pipe(new Readline({ delimiter: '\n' }));


// The open event is always emitted
port.on('open', function () {
    // open logic
    console.log("Com Port was opened...")
});

// Display incomming serial port data
port.on('data', function (data) {
    console.log('Data:', data.toString());
});

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message)
});


/******************************************
 * Process Game controller events
 * Buttons first
 */
ctrl.connect(function () {
    console.log('Game On!');
});

// Button 1 is mapped to HOME
ctrl.on('1:release', function () {
    console.log('1 was released moving home..');
    moveHome();
});

// Button 3 is mapped to INFO
ctrl.on('3:release', function () {
    console.log('3 was released');
    port.write('M114\r')
});

// Start Button is mapped to Energize the steppers
ctrl.on('Start:release', function () {
    console.log('Start was released');
    port.write('M17\r');
    console.log('.................')
});

// Select Button is mapped to power-off the steppers
ctrl.on('Select:release', function () {
    console.log('Select was released');
    port.write('M18\r')
});

// Left trigger (L1) Button is mapped to openGripper
ctrl.on('L1:press', function (o) {
    console.log('button:L1');
    openGripper();
});
// Right trigger (R1) Button is mapped to closeGripper
ctrl.on('R1:press', function (o) {
    console.log('button:R1');
    closeGripper();
});


/******************************************
 * Process Game controller events (JoySticks)
 **/

 // Left stick (x/y axis)
 ctrl.on('JOYL:move', function(o) {
     xyAxis.x = o.x;
     xyAxis.y = o.y;
    });
    
// Right stick (z axis)
ctrl.on('JOYR:move', function (o) {
    zAxis.x = o.x;
    zAxis.y = o.y;
});


// Handle error/disconnection events from the game controller
ctrl.on('error', function () {
    console.log('Controller could not be found');
});

ctrl.on('close', function () {
    console.log('Closing the controller, nothing else to do.');
});


/**
 * Main loop to process continuous events while the sticks are moved from rest positions.
 * It will call the move methods at a rapid interval
 */
setInterval(function() {
    // If no axis are touched exit. No time to waste.
    if(xyAxis.x == 128 && xyAxis.y == 128 && zAxis.y == 128) {
        return;
    }
    
    // Diplay stick position (debug)
    if(xyAxis.x != 128) {
        console.log('X: ', xyAxis.x);
    }
    if(xyAxis.y != 128) {
        console.log('Y: ', xyAxis.y);
    }
    if(zAxis.y != 128) {
        console.log('Y: ', zAxis.y);
    }
    
    // Call move methods for each axis
    moveX(xyAxis);
    moveY(xyAxis);
    moveZ(zAxis);
}, MOVE_FREQ);  

/**********************************************
 * Move function bellow
 * G-code
 */
const DIST_AND_SPEED = STEPS_DISTANCE + " F" + STEPS_SPEED +"\r";
function moveHome() {
    port.write('G90\r')                 // Set to ABSOLUTE coordinate mode
    port.write('G28\r');                // Go to home position (end-stop)
    port.write('G1 X0 Y120 Z100 F30\r');    // Move to a good "Ready" position
    port.write('G91\r')                 // Set to RELATIVE coordinate mode
}
function moveX(o) {
    // console.log(o);
    if(o.x > 128) {
        port.write("G1 X" + DIST_AND_SPEED);
        //port.write("G1 X1 F30\r")
    } 
    if(o.x < 128) {
        port.write("G1 X-" + DIST_AND_SPEED);
        //port.write("G1 X-1 F30\r")
    }
}
function moveY(o) {
    // console.log(o);
    if(o.y > 128) {
        port.write("G1 Y" + DIST_AND_SPEED);
        // port.write("G1 Y1 F30\r")
    } 
    if(o.y < 128) {
        port.write("G1 Y-" + DIST_AND_SPEED);
        // port.write("G1 Y-1 F30\r")
    }
}
function moveZ(o) {
    // console.log('Z:', o.y);
    if(o.y < 128) {
        port.write("G1 Z" + DIST_AND_SPEED);
        // port.write("G1 Z1 F30\r")
    } 
    if(o.y > 128) {
        port.write("G1 Z-" + DIST_AND_SPEED);
        // port.write("G1 Z-1 F30\r")
    }
}

// Gripper functions
function openGripper() { port.write("M3\r") }
function closeGripper() { port.write("M5\r") }