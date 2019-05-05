var express = require("express");
var bodyParser = require("body-parser");

const serialport = require('./robot_serial');
const ctrl = require('./robot_controller');
const Robot = require('./robot_command');
// var config = require("./config.js")
var app = express();


const robot = new Robot(serialport);
// Start the gamecontroller handler
ctrl.start(robot);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var router = express.Router();

app.route("/").get(function (req, res) {
    res.status(200).send("Welcome to our restful API");
});
app.route("/home").get(function (req, res) {
    robot.moveHome();
    res.status(200).send("Home command was Sent..");
});
app.route("/power/:io").get(function (req, res) {
    var power = req.query.io;
    if(power == 1) {
        robot.powerUpSteppers();
    } else {
        robot.powerDownSteppers();
    }
    res.status(200).send("Power command was Sent..");
});

app.route("/move").post(function (req, res) {
    // Movement {
        //     axis: string;
        //     mode: String;
        //     value: string;
        //     speed: number;
        //   }
        
        var movement = req.body;
        console.log(movement);
        
        robot.relMoveSingle(movement)
        
        
        res.status(200).send("Move Sent..");
    });
    
    app.route("/movefull").post(function (req, res) {
        // absolutePosition {
            //     X: number;
            //     Y: number;
            //     X: number;
            //     speed: number;
            //   }
            var absolutePosition = req.body;
            console.log(absolutePosition);
            robot.absoluteMove(absolutePosition);
            res.status(200).send("Move Sent..");

});


/*********************************************************************
* Start the servers (API & Angular client)
* Get port from environment and store in Express.
*********************************************************************/
var port = parseInt(process.env.PORT || '3000');

var server = app.listen(port, function () {
    console.log("app running on port.", server.address().port);
});