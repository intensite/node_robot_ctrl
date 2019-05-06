const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
// const Readline = SerialPort.parsers.Readline;

const COM_PORT = "COM8";
const BAUD_RATE = 115200;

// Setup COM port 
const port = new SerialPort(COM_PORT, { baudRate: BAUD_RATE });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

// The open event is always emitted
port.on('open', function () {
    // open logic
    console.log("Com Port was opened...")
});

// Display incomming serial port data using the READLINE parser
parser.on('data', console.log)

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message)
});

module.exports.port = port;
module.exports.parser = parser;
