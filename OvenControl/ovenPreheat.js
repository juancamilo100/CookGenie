var greenBean = require("green-bean");
var temperature = parseInt(process.argv[2]);
var minutes = parseInt(process.argv[3]);
process.on('uncaughtException', (err) => {
    console.log('**' + temperature + ',' + minutes + 'Failed to start child process.');
    process.exit(0);
});
greenBean.connect("range", function(range) {
    range.upperOven.cookMode.write({
        mode: 18,
        cookTemperature: temperature,
        cookHours: 0,
        cookMinutes: minutes
    }, function() {
        console.log('inside write');
        process.exit(0);
    });

});
// range.upperOven.cookMode.read(function(value) {
//     console.log("upper oven cook mode is:", value);
// });

//   range.upperOven.remoteEnable.read(function(value) {
//      console.log("upper oven remote enable is:", value);
//  });

// range.upperOven.remoteEnable.write(1);
// range.upperOven.cookMode.write({
//     mode: 18,
//     cookTemperature: 450,
//     cookHours: 0,
//     cookMinutes: 30
// });


// range.upperOven.remoteEnable.write(1);
// range.upperOven.cookMode.write({
//     mode: 18,
//     cookTemperature: 250,
//     cookHours: 0,
//     cookMinutes: 20
// });
// });
