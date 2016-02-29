var helper = require("./test-helperfunctions.js");

setInterval(function () {
  console.log("adding a child");
  helper.addEntry();}, 3000);
