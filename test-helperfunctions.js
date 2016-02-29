var moment = require("moment");
var Firebase = require("firebase");
var danger_Ref = new Firebase("https://smiley-helper.firebaseio.com/collectionsBackup");

exports.addEntry = function() {
  console.log("addentry has been called");
  var now = moment();
  var time = now.valueOf();
  danger_Ref.push({
    branch: 'Craig',
    device: {
      branch: 'testing',
      series: 'upgrades'
    },
    repair: 'NewRepair',
    timestamp: time
  });
};
