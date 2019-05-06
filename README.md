# node_robot_ctrl
Robot control app using node.js

This app's main goal is to serve as a back-end for a web based application to control the Ftobler's robot.  To do so it  provides a REST API to communicate with a Web based graphical user interface.  It also provides an interface to control the robot using a game controller (like xbox or playstation).

As of now, the following API end points are defined:

* GET:  / <br/>
  Display a test message if working (Welcome to our robot restful API)

* GET:  /home <br/>
  Send the home command to the robot (G28)

* GET:  /power/:io  (Where :io is 1=ON; 0=OFF) <br/>
  Power ON or OFF the stepper motors

* GET: /info <br/>
  Returns the actual absolute position of all axis.
  
* POST: /move <br/>
  Move a single axis of the arm in relative mode a certain distance and a certain speed. The post data should have this format: 
    ```    
    axis:X 
    mode:relative
    value:150
    speed:100
    ```    
* POST: /movefull <br/>
  Move all the arm axis to a specific absolute position.  The POST data should look like this:
  ```
  X:50
  Y:100
  Z:0
  speed:100
  ```


Note: The Node_robot_ctrl assumes the robot firmware supports the following gcode commands:

* G90 & G91: Used to set the coordinates in Absolute / Relative mode.
* M114: Used to get Current Position.
* M17 & M18: Used repectively to power up or down the stepper motors.
* Support for partial coordinate movements commands like: G1 X100
    
All these features are available in my version of the firmware available at: https://github.com/intensite/robotarm

## Ideas
 * Use button to save positions for programming complex movements
 * 
