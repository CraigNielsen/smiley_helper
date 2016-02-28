var express = require('express');
var app = express();
var Firebase = require("firebase");
var moment = require("moment");

var dayCount;
var weekCount;
var monthCount;
var now = moment();

var dangerRef = new Firebase("https://smiley-helper.firebaseio.com/collectionsBackup");
var statsRefDay = new Firebase("https://smiley-helper.firebaseio.com/stats/today");
var statsRefWeek = new Firebase("https://smiley-helper.firebaseio.com/stats/thisWeek");
var statsRefMonth = new Firebase("https://smiley-helper.firebaseio.com/stats/thisMonth");

function copyFbRecord(oldRef, newRef) {
     oldRef.once('value', function(snap)  {
      //  console.log (snap.val());
          newRef.set( snap.val(), function(error) {
               if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
               else {console.log("Successfully Copied Firebase Database");}
          });
     });
}
// copyFbRecord(refT,newRef1);
// newRef1.remove();

var outputCurrentCounts = function(when) {
  console.log(when + " " + dayCount + " today\n" + weekCount + " this week\n" + monthCount + " this month\n");
}
var write_to_stats_page = function() {
  statsRefDay.set({
    "count": dayCount
  });
  statsRefWeek.set({
    "count": weekCount
  });
  statsRefMonth.set({
    "count": monthCount
  });
};

var ref = new Firebase("https://smiley-helper.firebaseio.com/collectionsBackup");
var refresh = function() {
  //if time is 00:00: else do nothing
  console.log("refreshing stats counters");
  now = moment();
  var refToday = ref.orderByChild("timestamp").startAt(now.subtract(1, 'hour').valueOf());
  now = moment();
  var refThisWeek = ref.orderByChild("timestamp").startAt(now.subtract(7, 'day').valueOf());
  now = moment();
  var refThisMonth = ref.orderByChild("timestamp").startAt(now.subtract(30, 'day').valueOf());
  now = moment();
  console.log("refreshing at: " + now.valueOf());

  refThisMonth.once("value", function(snapshot0) {
    monthCount = snapshot0.numChildren();
  });
  refThisWeek.once("value", function(snapshot1) {
    weekCount = snapshot1.numChildren();
  });
  refToday.once("value", function(snapshot2) {
    dayCount = snapshot2.numChildren();
  });
  //write to database
  console.log("wrote to database")
};


setInterval(refresh, 30000);
refresh();

var initialised = null;
dangerRef.orderByChild("timestamp").limitToLast(1).on("child_added", function(snap) {
  if (initialised === null) {
    console.log("initializing...");
    console.log(snap.val());
    initialised = true;
  } else {
    console.log("updating count...");
    dayCount++;
    monthCount++;
    weekCount++;
    console.log("added: \n", snap.val());
    // outputCurrentCounts();
    // write to database
    write_to_stats_page();
  }
});

var addEntry = function() {
  now = moment();
  time = now.valueOf();
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
