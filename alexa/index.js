'use strict';
var Particle = require('particle-api-js');
var AlexaSkill = require('./AlexaSkill');
// var recipes = require('./recipes');
var particle = new Particle();

function parseData(number, element) {
  var output = [];
  var numberString = number.toString();

  for (var i = 0, len = numberString.length; i < len; i += 1) {
      output.push(+numberString.charAt(i));
  }
  if(element == "recipe") {
    return output[0];
  } else if(element == "step") {
    return output[1];
  }
}

function GetRecipeIndex(number) {
  return parseInt(number.toString().charAt(0)) - 1;
  // return parseData(number, "recipe") - 1;
}

function GetRecipeStep(number) {
  return parseInt(number.toString().charAt(1));
  // return parseData(number, "step");
}

var recipes = [
  {
    name: "pumpkin pie",
    steps: [
      ["2 eggs plus the yolk of a third egg",
      "1/2 cup packed dark brown sugar",
      "1/3 cup white sugar"],
      "%%%%425",
      "Beat the eggs in a large bowl. Mix in the brown sugar, white sugar, salt, spices—cinnamon, ground ginger, nutmeg, ground cloves, cardamom, and lemon zest.",
      "Mix in the pumpkin purée. Stir in the cream. Beat together until everything is well mixed.",
      "&&&&425;2",
      "&&&&350;3"
    ]
  },
  {
    name: "beef brisket",
    steps: [
      ["3 to 4 pounds of a brisket cut of beef",
      "3/4 cup barbeque sauce",
      "1/4 cup soy sauce",
      "1 cup of water"],
      "%%%%300",
      "In a bowl, mix together the barbeque sauce, soy sauce, and water.",
      "Place the brisket roast on a large piece of aluminum foil. Spread the BBQ sauce mixture generously over meat. Wrap the brisket in aluminum foil and place it in a roasting pan inside the oven.",
      "&&&&300;60",
      "Remove from oven and let rest in the foil for 30 minutes before serving."
    ]
  }
];

function getRecipeMaxNumberOfSteps(recipeIndex) {
  return recipes[recipeIndex].steps.length;
}

var APP_ID = "";

var PARTICLE_DEVICE_ID = "";
var PARTICLE_ACCESS_TOKEN = "";

var ParticleSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

ParticleSkill.prototype = Object.create(AlexaSkill.prototype);
ParticleSkill.prototype.constructor = ParticleSkill;

function sendCommand(command, callback) {
  particle.callFunction({
        deviceId: PARTICLE_DEVICE_ID,
        name: 'test',
        argument: command,
        auth: PARTICLE_ACCESS_TOKEN })
        .then(function(data){
            callback(data.body.return_value);
        },
        function(err) {
            response.tell("There was an error dude. " + err);
        });
}

ParticleSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ParticleSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

ParticleSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ParticleSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Cook Genie.  Im your recipe making assistant.  Which recipie would you like to cook today?";
    var repromptText = "You can ask me what recipes I have available for you";
    response.ask(speechOutput, repromptText);
};

ParticleSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("ParticleSkill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

ParticleSkill.prototype.intentHandlers = {
    "HelloWorldIntent": function (intent, session, response) {
      particle.callFunction({
            deviceId: PARTICLE_DEVICE_ID,
            name: 'test',
            argument: 'Something',
            auth: PARTICLE_ACCESS_TOKEN })
            .then(function(data){
              // console.log(data);
              response.tell("The data returned was" + data.body.return_value);
            },
            function(err) {
                response.tell("There was an error dude. " + err);
            });
    },
    "AvailableRecipes": function (intent, session, response) {
        var allRecipes = "";
        var speechOutput = "";
        var repromptText = "";
        for(var i = 0; i < recipes.length; i++)
        {
          allRecipes += recipes[i].name;
          allRecipes += ", ";
        }
        speechOutput = "Your available recipes are: " + allRecipes + "What would you like to cook?";
        repromptText = "You can tell me what recipe you would like to cook";
        response.ask(speechOutput, repromptText);
    },
    "StartRecipe": function (intent, session, response) {
      var chosenRecipe = intent.slots.Recipe.value;
      var recipeIndex = recipes.findIndex(x => x.name==chosenRecipe);
      var ingredients = "";
      for(var i = 0; i < recipes[recipeIndex].steps[0].length; i++)
      {
        ingredients += recipes[recipeIndex].steps[0][i];
        ingredients += ", ";
      }
      recipeIndex += 1;
      // response.tell("Let's start making " + chosenRecipe + ". " + "The ingredients you need are :" + ingredients + ". Tell me when you are ready to continue.");
      sendCommand("startRecipe;" + recipeIndex, function(returnValue){
          response.tell("Let's start making " + chosenRecipe + ". " + "The ingredients you need are :" + ingredients + ". You can use the Simblee scale to measure portions. Tell me when you are ready to continue.");
      });
    },
    "NextStep": function (intent, session, response) {
      sendCommand("nextStep", function(returnValue){
        var currentStep = GetRecipeStep(returnValue);
        var currentRecipeIndex = GetRecipeIndex(returnValue);
        var currentStepText = recipes[currentRecipeIndex].steps[currentStep];

        if(currentStep <= getRecipeMaxNumberOfSteps(currentRecipeIndex)) {
          if(currentStepText.indexOf("%%%%") != -1) {
            var ovenTemperature = currentStepText.replace("%%%%", "");
            sendCommand("preheatOven;" + ovenTemperature, function(returnValue) {
                response.tell("Preheating your oven at " + ovenTemperature + " degrees.  In the meantime, you can continue with the next step. " + recipes[currentRecipeIndex].steps[currentStep + 1]);
            })
          } else if(currentStepText.indexOf("&&&&") != -1) {
            var ovenProfile = currentStepText.replace("&&&&", "");
            var ovenTemperature = ovenProfile.trim().split(';')[0];
            var cookTime = ovenProfile.trim().toLowerCase().split(';')[1];

            sendCommand("ovenProfile;" + ovenProfile, function(returnValue) {
              response.tell("Now, you oven will cook at " + ovenTemperature + " degrees for " + cookTime + " minutes. The timer alarm will let you know when cooking is done. Let me know when that happens");
            });
          }
          else {
            response.tell("Now, " + currentStepText + ". Tell me when you are ready with this step");
          }
        }
        else {
          response.tell("Congratulations, you are done with your recipe.  I hope you enjoy your meal");
        }
      });
    },
    "RepeatInstruction": function (intent, session, response) {
      sendCommand("repeat", function(returnValue){
        var currentStep = GetRecipeStep(returnValue);
        var currentRecipeIndex = GetRecipeIndex(returnValue);
        var currentStepText = recipes[currentRecipeIndex].steps[currentStep];

        response.tell("Of course.  the current step is as follows: " + currentStepText);
      });
    },
    "GetIngredients": function (intent, session, response) {
      sendCommand("repeat", function(returnValue){
        var currentRecipeIndex = GetRecipeIndex(returnValue);

        var ingredientsText = "Here are the ingredients you need: ";
        for(var i = 0; i < recipes[currentRecipeIndex].steps[0].length; i++)
        {
          ingredientsText += recipes[currentRecipeIndex].steps[0][i];
          ingredientsText += ". ";
        }

        response.tell(ingredientsText);
      });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "You can ask me for the temperature or humidity";
        response.ask(speechOutput);
    },
    "AMAZON.CancelIntent": function(intent, session, response) {
        var speechOutput = "Thanks for using Cook Genie.  See you at your next meal!";
        response.tell(speechOutput);
    },
};

exports.handler = function (event, context) {
    // Create an instance of the ParticleSkill skill.
    var particleSkill = new ParticleSkill();
    particleSkill.execute(event, context);
};
