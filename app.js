var express = require("express");
var bodyParser = require("body-parser");
var WebSocket = require("ws");

const serialport = require('./robot_serial');
const ctrl = require('./robot_controller');
const Robot = require('./robot_command');
// var config = require("./config.js")
var app = express();
const robot = new Robot(serialport);
let current_position = "";

// Start the gamecontroller handler
ctrl.start(robot);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

// var router = express.Router();

app.route("/").get(function (req, res) {
    res.status(200).send("Welcome to our robot restful API");
});
app.route("/home").get(async function (req, res) {
    robot.moveHome();
    res.status(200).send("Home command was Sent..");
    current_position = await robot.getPosition();
});
app.route("/power/:io").get(function (req, res) {
    var power = req.query.io;
    if (power == 1) {
        robot.powerUpSteppers();
    } else {
        robot.powerDownSteppers();
    }
    res.status(200).send("Power command was Sent..");
});

app.route("/move").post(async function (req, res) {
    // Movement {
    //     axis: string;
    //     mode: String;
    //     value: string;
    //     speed: number;
    //   }

    var movement = req.body;
    console.log(movement);

    robot.relMoveSingle(movement)

    current_position = await robot.getPosition();
    res.status(200).send({ message: "Move Sent.." });
});

app.route("/movefull").post(async function (req, res) {
    // absolutePosition {
    //     X: number;
    //     Y: number;
    //     X: number;
    //     speed: number;
    //   }
    var absolutePosition = req.body;
    console.log("Inside movefull..");
    console.log(absolutePosition);
    robot.absoluteMove(absolutePosition);
    current_position = await robot.getPosition();
    res.status(200).send("Move Sent..");

});
app.route("/info").get(async function (req, res) {

    current_position = await robot.getPosition()
    res.status(200).send(current_position);
});


/*********************************************************************
* Start the servers (API & Angular client)
* Get port from environment and store in Express.
*********************************************************************/
var port = parseInt(process.env.PORT || '3000');

var server = app.listen(port, function () {
    console.log("app running on port.", server.address().port);
});

const wss = new WebSocket.Server({ port: 8088 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

});

setInterval(function () {
    wss.clients.forEach(async function each(client) {
        current_position = await robot.getPosition();
        
        client.send(JSON.stringify(current_position));
    });
}, 2000)
