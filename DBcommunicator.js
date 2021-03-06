var fs = require('fs');
var async = require('async');

var viewpath = __dirname + '/views/';
var datapath = __dirname + '/data/'
var schedulepath = datapath + '/schedules/'

var userdatapath = datapath + '/users/'
var statisticspath = datapath + '/statistics/';
var statFileName = 'hist_stats.json'

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var possibleDriveHours = {AM: [5,6,7,8,9,10], PM: [3,4,5,6,7,8]};

function createStatistics(){
  json = {"weeks":[], "poolDays":0, "users":[], "userList":[]};
  fs.writeFileSync(statisticspath + statFileName,  JSON.stringify(json));
}

var self = module.exports = {
  updateStatistics : function updateStatistics(unp_data, callback){
    try {
      fs.statSync(statisticspath+statFileName);
    }
    catch(err) {
      console.log("Thinks file doesn't exist.");
      createStatistics();
    }

    // load the stats file to modify data and then write over
    var stat = fs.readFileSync(statisticspath + statFileName,'utf8');
    var parsed = JSON.parse(stat);

    // parse week's schedule to update data with
    var data = JSON.parse(unp_data);
    console.log(unp_data);
    json = {}

    // add this week's schedule date to the list of weeks
    var date = self.userDataFileName(new Date());
    console.log("The date added:" + date);
    console.log("the list of weeks" + JSON.stringify(parsed.weeks));
    if (parsed.weeks.indexOf(date) > -1) {
      console.log("There was a midweek edit.  Stats being reset.");
      var index = parsed.weeks.indexOf(date);
      parsed.weeks.splice(index, 1);
      var users_impacted = 0;
      var total_days = 0;
      for (userIdx = 0; userIdx < parsed.users.length; userIdx++) {
        user = parsed.users[userIdx];
        if (user.hasOwnProperty(date)) {
          users_impacted++;
          total_days++;
          var driver_dec = user[date].driver_count;
          var rider_dec = user[date].rider_count;
          delete parsed.users[userIdx][date];
          parsed.users[userIdx].total_driver -= driver_dec;
          parsed.users[userIdx].total_rider -= rider_dec;
        }
      }
      parsed.poolDays -= total_days/users_impacted;
    }
    parsed.weeks.push(date);
    console.log("Date list is:" + parsed.weeks);

    carpoolers = {};

    // for each day of the pool, increment the number of pool days and keep track of carpoolers
    for (var weekdayIdx=0; weekdayIdx<weekdays.length; ++weekdayIdx) {
      var day = weekdays[weekdayIdx];
      var pool_day = data[day];

      if (Object.keys(pool_day).length != 0) {
        parsed.poolDays++;
        cars = Object.keys(pool_day);

        for (var car_Idx=0; car_Idx<cars.length; ++car_Idx) {
          var car_Id = cars[car_Idx];
          var car = pool_day[car_Id];
          var driver = car.driver;
          if (!(carpoolers.hasOwnProperty(driver))) {
            //var this_week = {"driver_count":1, "rider_count":0};
            var new_pooler = {"total_driver":1, "total_rider":0};//, "new_in_stats":False};
            new_pooler["week"] = {"driver_count":1, "rider_count":0};
            if (parsed.userList.indexOf(driver) < 0) {
              //new_pooler[new_in_stats] = True;
              new_pooler["userIdx"] = -1;
            }
            else {
              var user_Stats_Idx = parsed.userList.indexOf(driver);
              if (parsed.users[user_Stats_Idx].username != driver) {
                console.log("Error, user list is not in same order as users");
              }
              new_pooler["userIdx"] = user_Stats_Idx;
            }
            carpoolers[driver] = new_pooler;
          }
          else {
            // The driver is already in the carpoolers list
            carpoolers[driver].week.driver_count++;
            carpoolers[driver].total_driver++;
          }
          var passengers = [];
          if (car.hasOwnProperty("AM")) {
            var passengers = car.AM.passengers;
            for (var pass_Idx=0; pass_Idx<passengers.length; ++pass_Idx) {
              var passenger = passengers[pass_Idx];
              if (passenger == driver) {
                continue;
              }
              if (!(passenger in carpoolers)) {
                var new_pooler = {"total_driver":0, "total_rider":.5};//, "new_in_stats":False};
                new_pooler["week"] = {"driver_count":0, "rider_count":.5};
                if (parsed.userList.indexOf(passenger) <0) {
                  //new_pooler[new_in_stats] = True;
                  new_pooler["userIdx"] = -1;
                }
                else {
                  var user_Stats_Idx = parsed.userList.indexOf(passenger);
                  if (parsed.users[user_Stats_Idx].username != passenger) {
                    console.log("Error, user list is not in same order as users");
                  }
                  new_pooler["userIdx"] = user_Stats_Idx;
                }
                carpoolers[passenger] = new_pooler;
              }
              else {
                // The driver is already in the carpoolers list
                carpoolers[passenger].week.rider_count+=.5;
                carpoolers[passenger].total_rider+=.5;
              }
            }
          }
          if (car.hasOwnProperty("PM")) {
            var passengers = car.PM.passengers;
            for (var pass_Idx=0; pass_Idx<passengers.length; ++pass_Idx) {
              var passenger = passengers[pass_Idx];
              if (passenger == driver) {
                continue;
              }
              if (!(passenger in carpoolers)) {
                var new_pooler = {"total_driver":0, "total_rider":.5};//, "new_in_stats":False};
                new_pooler["week"] = {"driver_count":0, "rider_count":.5};
                if (parsed.userList.indexOf(passenger) <0) {
                  //new_pooler[new_in_stats] = True;
                  new_pooler["userIdx"] = -1;
                }
                else {
                  var user_Stats_Idx = parsed.userList.indexOf(passenger);
                  if (parsed.users[user_Stats_Idx].username != passenger) {
                    console.log("Error, user list is not in same order as users");
                  }
                  new_pooler["userIdx"] = user_Stats_Idx;
                }
                carpoolers[passenger] = new_pooler;
              }
              else {
                // The driver is already in the carpoolers list
                carpoolers[passenger].week.rider_count+=.5;
                carpoolers[passenger].total_rider+=.5;
              }
            }
          }          
        }
      }
    }
    
    var users = Object.keys(carpoolers)
    
    for (var user_Idx=0; user_Idx<users.length; ++user_Idx ) {
      var user = users[user_Idx];
      if (carpoolers[user].userIdx == -1) {
        var new_driver = {};
        new_driver["username"] = user;
        new_driver[date] = carpoolers[user].week;
        new_driver["total_driver"] = carpoolers[user].total_driver;
        new_driver["total_rider"] = carpoolers[user].total_rider;
        parsed.users.push(new_driver);
        parsed.userList.push(user);
      }
      else {
        var index = carpoolers[user].userIdx;
        parsed.users[index][date] = carpoolers[user].week;
        parsed.users[index]["total_driver"] += carpoolers[user].total_driver;
        parsed.users[index]["total_rider"] += carpoolers[user].total_rider;
      }
      
      //new_driver[user] = carpoolers[user];
      
    }
    //pass data to file to write out to stats file
    fs.writeFile(statisticspath + statFileName,  JSON.stringify(parsed));
  },
  getStatistics : function getStatistics(callback){
  	try {
      fs.statSync(statisticspath+statFileName);
    }
    catch(err) {
      console.log("Thinks file doesn't exist.");
      createStatistics();
    }
    var jsoncontent = fs.readFileSync(statisticspath + statFileName);
    var dataForStatPage = JSON.parse(jsoncontent);
    callback(dataForStatPage);
  },
  getAllPreferences : function getAllPreferences(callback){
    fs.readdir(userdatapath, function(err, files) {
      if (err) {
        console.log('Failed reading the user data directory');
        process.exit(1);
      }
      async.map(files, function(userEmail, callback) {
        self.getPreferences(userEmail, function(preferences){
          callback(undefined, preferences);
        });
      }, function(err, allPreferences) {
        var allPreferencesObj = {};
        for (var i=0; i<allPreferences.length; ++i) {
          allPreferencesObj[allPreferences[i].email] = allPreferences[i];
        }
        callback(allPreferencesObj);
      });
    });
  },
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
                  console.log(scheduleData[key]);
                  console.log(key);
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