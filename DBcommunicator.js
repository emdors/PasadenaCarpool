var fs = require('fs');
var async = require('async');

var viewpath = __dirname + '/views/';
var datapath = __dirname + '/data/'
var schedulepath = datapath + '/schedules/'
var userdatapath = datapath + '/users/';


var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var possibleDriveHours = {AM: [5,6,7,8,9,10], PM: [3,4,5,6,7,8]};


var self = module.exports = {
  getSchedule :function getSchedule(day, callback) {
    fs.readFile(schedulepath + self.userDataFileName(day), 'utf8', function(err, data) {
      if (err || !data) {
        // Build empty schedule, with an empty object for each day
        var sch = {};
        for (var weekdayIdx=0; weekdayIdx<weekdays.length; ++weekdayIdx) {
          sch[weekdays[weekdayIdx]] = {};
        }
        callback(sch);
      } else {
        callback(JSON.parse(data));
      }
    });
  },
  // Get the filename for the user data for the given week. If there's no
  // argument, use *next* week. Returns string like 2016-03-21, the date of the
  // Monday starting that week.
  userDataFileName : function userDataFileName(dateInput) {
    var date;

    if (typeof dateInput === 'string' && dateInput.length) {
      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date();
      date.setDate(date.getDate() + 7);
    }
    // Magic to set the day to the previous Monday...
    date.setDate(date.getDate() - date.getDay() + 1);

    // Return it in right format
    return date.getFullYear() + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0'+date.getDate()).slice(-2);
  },
  getContactData : function getContactData(contactDataCallback){
    fs.readdir(userdatapath, function(err, files) {
      if (err) {
        console.log('Failed reading the user data directory');
        process.exit(1);
      }

      async.map(files, function(userEmail, callback) {
        if(userEmail !== undefined){
          self.getPreferences(userEmail, function(preferences){
            if(preferences == undefined){
              callback(null, undefined)

            }else{
              var dataForCallback = {
                prefEmail: preferences.prefEmail,
                name: preferences.name,
                numPassengers: preferences.numPassengers,
                phoneNumber: preferences.phoneNumber
              };
              callback(err, dataForCallback);
            }
          });
        }else{
          callback(null, undefined );
        }

      }, function(err, allResultsUnfiltered) {
        //console.log(allResultsUnfiltered);
        var filteredResults = allResultsUnfiltered.filter(function(r) { return r !== undefined; })
        contactDataCallback(filteredResults);
      });
    });
  },
  getPreferences : function getPreferences(userEmail, preferencesCallback){
    var fullFilename = userdatapath + userEmail + "/preferences"
    fs.readFile(fullFilename, 'utf8', function(err, data) {
      if (err) {
        console.log('Got error (' + fullFilename + ')');
        preferencesCallback(undefined);
      } else {
          var myData;
          try{
            myData = JSON.parse(data)
            if(myData.prefEmail == undefined){
              myData.prefEmail = userEmail
            }
            myData.email = userEmail
          }
          catch(e){
            myData = {
              name: "",
              phoneNumber: "",
              numPassengers: "",
              email: userEmail,
              prefEmail: userEmail
            }
          }
        //console.log(myData)
        preferencesCallback(myData);
      }
    });
  },
  //Pass in the date of data which we want to parse, undefined is nextweeks data
  parseData: function parseData(dateToParse, parseDataCallback) {
    fs.readdir(userdatapath, function(err, files) {
      if (err) {
        console.log('Failed reading the user data directory');
        process.exit(1);
      }
      //If the data we want to pull up is
      var thisWeeksScheduleFilename = self.userDataFileName(dateToParse);
      //console.log(thisWeeksScheduleFilename);

      async.map(files, function(userEmail, callback) {
        var fullFilename = userdatapath + userEmail + '/schedules/'
                           + thisWeeksScheduleFilename;
        fs.readFile(fullFilename, 'utf8', function(err, data) {
          if (err) {
            console.log('Got error (' + fullFilename + ')');
            callback(null, undefined);
          } else {
            //get the preferenence data
            self.getPreferences(userEmail, function(preferences){
              var dataForCallback = {
                email: preferences.email,
                prefEmail: preferences.prefEmail,
                name: preferences.name,
                numPassengers: preferences.numPassengers,
                phoneNumber: preferences.phoneNumber
              };
              
              var scheduleData = JSON.parse(data)
              for(var key in scheduleData) dataForCallback[key] = scheduleData[key];

              var newScheduleData = {}
              for(var key in scheduleData) {
                if (key != 'name' && key != 'email' && key != 'numPassengers') {
                  newScheduleData[key] = scheduleData[key];
                }
              }
              fs.writeFile(fullFilename, JSON.stringify(newScheduleData));

              callback(err, dataForCallback);
            });
          }
        });
      }, function(err, allResultsUnfiltered) {
        //console.log(allResultsUnfiltered);
        var allResults = allResultsUnfiltered.filter(function(r) { return r !== undefined; });
        var parsedResults = [];
        for (var dayIdx=0; dayIdx<weekdays.length; ++dayIdx) {
          parsedResults.push({"day":weekdays[dayIdx], "times":[{"halfday": "AM", "people" : []}, {"halfday":"PM", "people":[]}]});
        }

        for (var resultIdx=0; resultIdx < allResults.length; ++resultIdx) {
          var result = allResults[resultIdx];

          for (var dayIdx=0; dayIdx<weekdays.length; dayIdx++) {
            var day = weekdays[dayIdx];
            for (var ampm in possibleDriveHours) {
              var thisPersonsTimes = result[day+ampm+'Times'];
              var canGos = [];

              for (var hrIdx = 0; hrIdx<possibleDriveHours[ampm].length; hrIdx++) {
                var hr = possibleDriveHours[ampm][hrIdx];
                for (var min=0; min<60; min += 15) {
                  var hrMin = hr*100 + min;
                  var canGo = thisPersonsTimes.indexOf(hrMin) != -1;
                  canGos.push({time:hrMin, canGo: canGo});
                }
              }
              // Using filter instead of find because node on Knuth does not have find
              // Also why I'm using the function(x) {return y;} syntax rather than x=>y
              parsedResults.filter(
                  //d => d.day == day
                  function(d) { return d.day == day; }
                )[0].times.filter(
                  //hd => hd.halfday == ampm
                  function (hd) { return hd.halfday == ampm; }
                )[0].people.push({
                  name: result.name,
                  notes: result[day + 'notes'],
                  driveStatus: result[day + 'DriveStatus'],
                  canGos: canGos,
                  numPassengers: result.numPassengers,
                  email: result.email,
                  prefEmail: result.prefEmail,
                  phoneNumber: result.phoneNumber
                });
            }
          }

          for (var dayIdx=0; dayIdx<parsedResults.length; dayIdx++) {
            var dayData = parsedResults[dayIdx];
            for (var ampmIdx=0; ampmIdx<dayData.times.length; ampmIdx++) {
              var ampmdata = dayData.times[ampmIdx];
              // Sort the people by their earliest/latest 'selected' entry (earliest if
              // PM, latest if AM)
              ampmdata.people.sort(function(p1, p2) {
                for (var canGoIdx=0; canGoIdx<p1.canGos.length; canGoIdx++) {
                  var realIdx = ampmdata.halfday == 'AM'?
                    p1.canGos.length-canGoIdx-1 : canGoIdx;
                  if (p1.canGos[realIdx].canGo) return -1;
                  if (p2.canGos[realIdx].canGo) return 1;
                }
                return 0;
              });
            }
          }
        }

        parseDataCallback(parsedResults);
      });
    });
  }
  
};