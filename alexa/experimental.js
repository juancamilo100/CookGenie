var recipes = [
  {
    name: "pumpkin pie",
    steps: [
      ["2 eggs plus the yolk of a third egg",
      "1/2 cup packed dark brown sugar",
      "1/3 cup white sugar"],
      "%%%%450",
      "I am Preheating your oven to 425°F. ",
      "Beat the eggs in a large bowl. Mix in the brown sugar, white sugar, salt, spices—cinnamon, ground ginger, nutmeg, ground cloves, cardamom, and lemon zest.",
      "Mix in the pumpkin purée. Stir in the cream. Beat together until everything is well mixed.",
      "Bake at a high temperature of 425°F for 15 minutes. Then after 15 minutes, lower the temperature to 350°F."
    ]
  },
  {
    name: "beef brisket",
    steps: [
      ["3 to 4 lbs of a brisket cut of beef",
      "3/4 cup barbeque sauce",
      "1/4 cup soy sauce",
      "1 cup of water"],
      "Preheat oven to 300ºF",
      "In a bowl, mix together the barbeque sauce, soy sauce, and water.",
      "Place the brisket roast on a large piece of aluminum foil. Spread the BBQ sauce mixture generously over meat. Wrap the brisket in aluminum foil and place it in a roasting pan. Bake for 1 hour for every 1 pound of meat.",
      "Remove from oven and let rest in the foil for 30 minutes before serving."
    ]
  }
];

var numberexapmle = 34;

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
  return number.toString().charAt(0);
  // return parseData(number, "recipe") - 1;
}

function GetRecipeStep(number) {
  return number.toString().charAt(1);
  // return parseData(number, "step");
}

var recipe = GetRecipeIndex(numberexapmle);
var recipeStep = GetRecipeStep(numberexapmle);

console.log("recipe index: " + recipe + " and recipe step: " + recipeStep);

var currentStep = GetRecipeStep(11);
var currentRecipeIndex = GetRecipeIndex(11);
var currentStepText = recipes[currentRecipeIndex].steps[currentStep];
// console.log(currentStepText.indexOf("%%%%"));
if(currentStepText.indexOf("%%%%") != -1) {
  var ovenTemperature = currentStepText.replace("%%%%", "");
  console.log("Preheating your oven at " + ovenTemperature + " degrees");
}
else {
  // console.log(currentStepText);
}
