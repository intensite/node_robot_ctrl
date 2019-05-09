const STEPS_DISTANCE = 1;       // Distance of each steps (in mm)
const STEPS_SPEED = 30;         // Speed of the stepper moves (in mm/s)
const DIST_AND_SPEED = STEPS_DISTANCE + " F" + STEPS_SPEED + "\r";

// export interface Movement {
//     axis: string;
//     mode: String;
//     value: string;
//     speed: number;
//   }

class Robot {

    constructor(serialPort) {
        this.port = serialPort.port;
        this.parser = serialPort.parser;
    }

    /**********************************************
     * Move function bellow
     * G-code
     */
    moveHome() {
        this.port.write('G90\r')                        // Set to ABSOLUTE coordinate mode
        this.port.write('G28\r');                       // Go to home position (end-stop)
        this.port.write('G1 X0 Y120 Z100 F30\r');       // Move to a good "Ready" position
        this.port.write('G91\r')                        // Set to RELATIVE coordinate mode
    }
    stickMoveX(o) {
        // console.log(o);
        if (o.x > 128) {
            this.port.write("G1 X" + DIST_AND_SPEED);
        }
        if (o.x < 128) {
            this.port.write("G1 X-" + DIST_AND_SPEED);
        }
    }
    stickMoveY(o) {
        // console.log(o);
        if (o.y > 128) {
            this.port.write("G1 Y" + DIST_AND_SPEED);
        }
        if (o.y < 128) {
            this.port.write("G1 Y-" + DIST_AND_SPEED);
        }
    }
    stickMoveZ(o) {
        // console.log('Z:', o.y);
        if (o.y < 128) {
            this.port.write("G1 Z" + DIST_AND_SPEED);
        }
        if (o.y > 128) {
            this.port.write("G1 Z-" + DIST_AND_SPEED);
        }
    }
    relMoveSingle(m) {
        // Relative move single axis

        this.port.write('G91\r')  // Set to RELATIVE coordinate mode

        switch (m.axis) {
            case 'X':
                this.port.write(`G1 X${m.value} F${m.speed}\r`);
                break;
            case 'Y':
                this.port.write(`G1 Y${m.value} F${m.speed}\r`);
                break;
            case 'Z':
                this.port.write(`G1 Z${m.value} F${m.speed}\r`);
                break;
            default:
        }

    }
    absoluteMove(m) {
        // Absolute move multiple axis

        this.port.write('G90\r')  // Set to ABSOLUTE coordinate mode
        var gcode = 'G1' + (m.X ? ' X' + m.X : '') + (m.Y ? ' Y' + m.Y : '') + (m.Z ? ' Z' + m.Z : '') + (m.speed ? ' F' + m.speed : '');

        console.log('Before send to robot..');
        console.log(gcode);
        this.port.write(`${gcode}\r`);
        // this.getPosition(); // Return the current positions of all axis 
    }

    // Gripper functions
    openGripper() { this.port.write("M3\r") }
    closeGripper() { this.port.write("M5\r") }
    powerUpSteppers() { this.port.write("M17\r") }
    powerDownSteppers() { this.port.write("M18\r") }
    
    getPosition() { 
    // Return the current positions of all axis 
    var positionInfo = "";

    return new Promise((resolve, reject)=>{

        this.port.write("M114\r"); 

        this.parser.on('data', function (data) {
            if(data.startsWith("C: ")){
                positionInfo = data;
                resolve(positionInfo);
                // console.log('info:', data);
            }
        });
     })
    } 

}

module.exports = Robot;