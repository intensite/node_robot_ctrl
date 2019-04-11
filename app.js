const Gamecontroller = require('gamecontroller');
const ctrl = new Gamecontroller('jesstech');

ctrl.connect(function () {
    console.log('Game On!');
});

ctrl.on('1:press', function () {
    console.log('1 was pressed');
});

ctrl.on('1:release', function () {
    console.log('1 was released');
});
ctrl.on('3:press', function () {
    console.log('3 was pressed');
});

ctrl.on('3:release', function () {
    console.log('3 was released');
});

ctrl.on('JOYL:move', function (o) {
    console.log(o);
});
ctrl.on('JOYR:move', function (o) {
    console.log(o);
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