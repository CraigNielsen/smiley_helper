
var express = require('express');
var app = express();
var Firebase = require("firebase");
var moment = require("moment");
// app.get('/', function (req, res) {
//   res.send('Helper is running');
// });
//
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });
var dayCount;
var weekCount;
var monthCount;

var ref = new Firebase("https://ifixgroup.firebaseio.com/collections");
var now = moment();
var refToday = ref.orderByChild("timestamp").startAt(now.subtract(1, 'days').valueOf());
var refThisWeek = ref.orderByChild("timestamp").startAt(now.subtract(7, 'days').valueOf());
var refThisMonth = ref.orderByChild("timestamp").startAt(now.subtract(30, 'days').valueOf())//     var now = moment();
var refToday = ref.orderByChild("timestamp").startAt(now.subtract(1, 'days').valueOf());
var refThisWeek = ref.orderByChild("timestamp").startAt(now.subtract(7, 'days').valueOf());
var refThisMonth = ref.orderByChild("timestamp").startAt(now.subtract(30, 'days').valueOf());
console.log(refToday.lenth);
ref.limitToLast(2).on("child_added", function (snapshot) {

    console.log(snapshot.val());
  });
// var myDataRef = new Firebase('https://smiley-helper.firebaseio.com/someTests/day');
//     myDataRef.set({name: "Day", text: "7"});
