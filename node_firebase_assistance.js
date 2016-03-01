var Firebase = require("firebase");

var oldRef= new Firebase("https://ifixgroup.firebaseio.com/collections").orderByChild("timestamp").limitToLast(100);
var newRef= new Firebase("https://smiley-helper.firebaseio.com/collectionsBackupNoGlobal");


function copyFbRecord(oldRef, newRef) {
  oldRef.once('value', function(snap) {
    newRef.set(snap.val(), function(error) {
      if (error && typeof(console) !== 'undefined' && console.error) {
        console.error(error);
      } else {
        console.log("Successfully Copied Firebase Database");
      }
    });
  }).then(function () {console.log("copied Successfully")});
}
copyFbRecord(oldRef,newRef);
// newRef1.remove();


var outputCurrentCounts = function(when) {
  console.log(when + " " + dayCount + " today\n" + weekCount + " this week\n" + monthCount + " this month\n");
}
var addEntry = function() {
  var now = moment();
  var time = now.valueOf();
  dangerRef.push({
    branch: 'Craig',
    device: {
      branch: '',
      series: ''
    },
    repair: 'NewRepair',
    timestamp: time
  });
};
// setInterval(addEntry, 10000);
