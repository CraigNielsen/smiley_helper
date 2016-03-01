var Firebase = require("firebase");
var moment = require("moment");
var async = require("async");
var dayCount;
var weekCount;
var monthCount;

var ref = new Firebase("https://ifixgroup.firebaseio.com/collections");
var statsRefDay = new Firebase("https://ifixgroup.firebaseio.com/collections/stats/today");
var statsRefWeek = new Firebase("https://ifixgroup.firebaseio.com/collections/stats/thisWeek");
var statsRefMonth = new Firebase("https://ifixgroup.firebaseio.com/collections/stats/thisMonth");

var MINS = 60 * 1000;

var write_to_stats_page = function(callback) {
  console.log("write to stats page was called");
  statsRefDay.set({
    "count": dayCount
  });
  statsRefWeek.set({
    "count": weekCount
  });
  statsRefMonth.set({
    "count": monthCount
  });
  callback(null);
};

var refresh = function(currentTime) {
  //if time is before 00:30 in the day: refresh (this is checked every 30 mins)
  if (currentTime < 30) {
    console.log("refreshing stats counters");
    now = moment();
    var refToday = ref.orderByChild("timestamp").startAt(now.subtract(1, 'hour').valueOf());
    now = moment();
    var refThisWeek = ref.orderByChild("timestamp").startAt(now.subtract(7, 'days').valueOf());
    now = moment();
    var refThisMonth = ref.orderByChild("timestamp").startAt(now.subtract(30, 'days').valueOf());
    now = moment();
    console.log("refreshing at: " + now.valueOf());

    refThisMonth.once("value", function(snapshot0) {
      console.log("old month count " + monthCount);
      monthCount = snapshot0.numChildren();
      return monthCount;
    }).then(function(mc) {
      statsRefMonth.set({
        "count": monthCount
      })
    });
    refThisWeek.once("value", function(snapshot1) {
      weekCount = snapshot1.numChildren();
      return weekCount;
    }).then(function(wc) {
      statsRefWeek.set({
        "count": weekCount
      })
    });
    refToday.once("value", function(snapshot2) {
      dayCount = snapshot2.numChildren();
      return dayCount;
    }).then(function(dc) {
      console.log("daycount is set to :" + dc);
      statsRefDay.set({
        "count": dayCount
      })
    })
  }
};

refresh(25);
setInterval(function() {
  var now = moment();
  var ctime = now.format('HHmm');
  refresh(ctime);
}, 30 * MINS);

function updateCount(callback) {
  console.log("updateCount was called");
  dayCount++;
  monthCount++;
  weekCount++;
  callback(null);
}
var initialised = null;
ref.orderByChild("timestamp").limitToLast(1).on("child_added", function(snap) {
  if (initialised === null) {
    console.log("initializing...");
    initialised = true;
    console.log("initializing done")
  } else {
    console.log("updating count...");
    async.series([updateCount, write_to_stats_page], function() {
      console.log("added: \n", snap.val())
    })
  }
});
