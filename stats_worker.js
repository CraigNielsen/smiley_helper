var Firebase = require("firebase");
var moment = require("moment");
var async = require("async");
var request = require("request");
var hourCount;
var dayCount;
var weekCount;
var monthCount;
var allTimeCount;

var ref = new Firebase("https://ifixgroup.firebaseio.com/collections");
var statsRefDay = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/today");
var statsRefWeek = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/thisWeek");
var statsRefMonth = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/thisMonth");
var statsRefAll = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/allTime");
var statsRefHour = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/thisHour");

var MINS = 60 * 1000;
var write_to_stats_page = function(callback) {
  console.log("writing to stats page");
  statsRefHour.set({
    "count": hourCount
  });
  statsRefDay.set({
    "count": dayCount
  });
  statsRefWeek.set({
    "count": weekCount
  });
  statsRefMonth.set({
    "count": monthCount
  });
  statsRefAll.set({
    "count": allTimeCount
  });
  callback(null);
};

  var refresh = function(currentTime) {
  //if time is before xx:30 in the day: refresh (this is checked every 30 mins)

  if (currentTime < 30) {
    now = moment();
    var refHour= ref.orderByChild("timestamp").startAt(now.startOf('hour').valueOf());
    now = moment();
    var refToday = ref.orderByChild("timestamp").startAt(now.startOf('day').valueOf());
    now = moment();
    var refThisWeek = ref.orderByChild("timestamp").startAt(now.startOf('week').valueOf());
    now = moment();
    var refThisMonth = ref.orderByChild("timestamp").startAt(now.startOf('month').valueOf());
    now = moment();

    console.log("refreshing stats counters at: " + now.format("HH:mm:ss"));

    refThisMonth.once("value", function(snapshot0) {
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
    refHour.once("value", function(snapshot) {
      hourCount = snapshot.numChildren();
      return hourCount;
    }).then(function(dc) {
      statsRefHour.set({
        "count": hourCount
      })
    });
    refToday.once("value", function(snapshot2) {
      dayCount = snapshot2.numChildren();
      return dayCount;
    }).then(function(dc) {
      console.log("daycount is set to :" + dc.numChildren());
      statsRefDay.set({
        "count": dayCount
      })
    });
    request('http://capetown.ifix.co.za/api/global/repairs/collections/count', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        allTimeCount = Number(body);
        statsRefAll.set({"count": Number(body)})
  }});
  }
};

refresh(25);
setInterval(function() {
  var now = moment();
  var ctime = now.format('mm');
  refresh(ctime);
}, 30 * MINS);

function updateCount(callback) {
  hourCount++;
  dayCount++;
  monthCount++;
  weekCount++;
  allTimeCount++;
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
