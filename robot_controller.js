const Gamecontroller = require('gamecontroller');
const ctrl = new Gamecontroller('jesstech');  // Model of the controller (from ./node_modules/gamecontroller/vendors.js)

const MOVE_FREQ = 50;           // Frequency (in ms) at which the commands are sent to the robot

// Store Joystick coordinates
// Initialized to 128 => center position
var xyAxis = {
    x: 128, y: 128
};
var zAxis = {
    x: 128, y: 128
};

module.exports.start = function (robot) {

    /******************************************
     * Process Game controller events
     * Buttons first
     */
    try {
        ctrl.connect(function () {
            console.log('Game On!');
        });
    } catch (e) {
        console.log('Problem connecting to USB game controller controller.  Make sure it is connected');
        console.log(e.message)
    }

    // Button 1 is mapped to HOME
    ctrl.on('1:release', function () {
        console.log('1 was released moving home..');
        robot.moveHome();
    });

    // Button 3 is mapped to INFO
    ctrl.on('3:release', function () {
        console.log('3 was released');
        robot.getPosition();
    });

    // Start Button is mapped to Energize the steppers
    ctrl.on('Start:release', function () {
        console.log('Start was released');
        robot.powerUpSteppers();
    });

    // Select Button is mapped to power-off the steppers
    ctrl.on('Select:release', function () {
        console.log('Select was released');
        robot.powerDownSteppers();
    });

    // Left trigger (L1) Button is mapped to openGripper
    ctrl.on('L1:press', function (o) {
        console.log('button:L1');
        robot.openGripper();
    });
    // Right trigger (R1) Button is mapped to closeGripper
    ctrl.on('R1:press', function (o) {
        console.log('button:R1');
        robot.closeGripper();
    });


    /******************************************
     * Process Game controller events (JoySticks)
     **/

    // Left stick (x/y axis)
    ctrl.on('JOYL:move', function (o) {
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
    setInterval(function () {
        // If no axis are touched exit. No time to waste.
        if (xyAxis.x == 128 && xyAxis.y == 128 && zAxis.y == 128) {
            return;
        }

        // Diplay stick position (debug)
        if (xyAxis.x != 128) {
            console.log('X: ', xyAxis.x);
        }
        if (xyAxis.y != 128) {
            console.log('Y: ', xyAxis.y);
        }
        if (zAxis.y != 128) {
            console.log('Y: ', zAxis.y);
        }

        // Call move methods for each axis
        robot.stickMoveX(xyAxis);
        robot.stickMoveY(xyAxis);
        robot.stickMoveZ(zAxis);
    }, MOVE_FREQ);

}
