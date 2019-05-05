const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const COM_PORT = "COM8";
const BAUD_RATE = 115200;

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

module.exports = port;
