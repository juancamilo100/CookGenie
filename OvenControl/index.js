var greenBean = require("green-bean");
var recipeIndex  = 1;
var currentStep= 0;
var serial = require('serialport');
var fork = require('child_process').fork;


var port = new serial('/dev/tty.usbmodem1421', {
	baudRate: 9600,
	parser: serial.parsers.readline('\n')
});


port.on('error', function(err) {
	console.log('Error: ', err.message);
});


port.on('data', function(data) {
  console.log('got it:'+data);
  if(data.trim().toLowerCase()=="something"){
    // currentStep=23;
    // port.write(recipeIndex+''+currentStep);
		// try{
			sendCommandToOven(450, 0, 30);
			port.write(recipeIndex+''+currentStep);
		// }catch(err){console.log('error');}


  }else if(data.trim().toLowerCase().indexOf("startrecipe")> -1){
			recipeIndex = data.trim().split(';')[1];
			currentStep =0;
      port.write(recipeIndex+''+currentStep);
  }else if(data.trim().toLowerCase()=="nextstep"){
		currentStep+=1;
      port.write(recipeIndex+''+currentStep);
  }else if(data.trim().toLowerCase().indexOf("preheatoven")>-1){
		 var temperature = data.trim().split(';')[1];
		console.log('preheating: '+temperature);
		currentStep+=1;
  	port.write(recipeIndex+''+currentStep);
	 	sendCommandToOven(temperature, 0, 0);
  }else if(data.trim().toLowerCase().indexOf("ovenprofile")>-1){
		 var temperature = data.trim().split(';')[1];
		 var minutes = data.trim().split(';')[2];
		console.log('cooking temp: '+temperature+', cooking time:'+minutes);
		// currentStep+=1;
  	port.write(recipeIndex+''+currentStep);
	 	sendCommandToOven(temperature, 0, minutes);
  }
	else if(data.trim().toLowerCase()=="current"){
      port.write(recipeIndex+''+currentStep);
  }else if(data.trim().toLowerCase()=="reset"){
      currentStep = 23;
      port.write(recipeIndex+''+currentStep);
  }else if(data.trim().toLowerCase().indexOf("repeat")> -1){
      port.write(recipeIndex+''+currentStep);
  }

});
function sendCommandToOven(temp, hours, minutes){
	var exec = require('child_process').exec;
	exec('node ovenPreheat.js '+temp+' '+minutes, function(error, stdout, stderr) {
	    // console.log('stdout: ' + stdout);
	    // console.log('stderr: ' + stderr);
	    if (error !== null) {
	        // console.log('exec error: ' + error);
	    }
	});


}
// sendCommandToOven(450);
