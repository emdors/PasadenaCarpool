var weekdays = [];

// Format:
// cars = {
//   Monday: {
//     basuka@gmail.com: {
//       AM: {
//         time: '830',
//         passengers: ['cansako@gmail.com', 'dalgo@g.hmc.edu']
//       },
//       PM: {
//         time: '545',
//         passengers: ['ffernanke@gmail.com', 'dalgo@g.hmc.edu', 'egantz@g.hmc.edu']
//       }
//     },
//   },
// };
var userData = {};
var changedPage = false;

window.onload = function(peopleDataInput) {
  var peopleData = peopleDataInput;
  var timeResults = document.getElementById("timeResults");

  var h3s = timeResults.getElementsByTagName("h3");
  for (var h3idx=0; h3idx<h3s.length; h3idx +=2) {
    var day = h3s[h3idx].textContent;
    weekdays.push(day);
    cars[day] = {};
  }

  //Checks if the time tables are clicked and responds accordingly
  var timetables = timeResults.getElementsByClassName("timetable");
  for (var timetableidx=0; timetableidx<timetables.length; ++timetableidx) {

    var ti = timetables[timetableidx];
    var tds = ti.getElementsByTagName("td");
    for (var tdIdx=0; tdIdx<tds.length; ++tdIdx) {
      var td = tds[tdIdx];

      if (td.getAttribute('selected')) {
        td.onmouseover = function() {
          this.setAttribute('mousedover', 'true');
        }
        td.onmouseleave = function() {
          this.setAttribute('mousedover', 'false');
        }

        //This function deals with being able to pick drivers and
        //Pasengers
        td.onclick = function() {
          //Commented out the code that used to select drivers/passengers
          //keeping here in case we want to reference how to select people 
          //Make sure that we can only change the car status of selected tiles.
          // if(this.getAttribute('selected') == 'true'){
          //   if (this.getAttribute('carstatus') == 'passenger'){
          //     this.setAttribute('carstatus', 'driver');
          //   } else if (this.getAttribute('carstatus') == 'driver'){
          //     this.setAttribute('carstatus', 'unassigned');
          //   } else{
          //     this.setAttribute('carstatus', 'passenger');
          //   }
          // }
        }
      }
    }
  }
  updateHighlightingAndTables();
}
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});

// Returns 'AM' or 'PM' or 'both' if they are a passenger or null if they are a
// driver or not yet assigned
function isPassengerForDay(day, email) {
  var numFound = 0;
  var foundHalfday;
  for (var otherdriveremail in cars[day]) {
    for (var halfdayIdx=0; halfdayIdx<2; ++halfdayIdx) {
      var halfday = ['AM', 'PM'][halfdayIdx];
      var hd = cars[day][otherdriveremail][halfday];
      if (hd) {
        for (var i=0; i<hd.passengers.length; ++i) {
          if (hd.passengers[i] == email) {
            ++numFound;
            foundHalfday = halfday;
          }
        }
      }
    }
    if (numFound == 2) {
      return 'both';
    }
  }
  if (numFound == 1) {
    return foundHalfday;
  }
  return null;
}

function updateHighlightingAndTables(day) {

  if (day === undefined) {
    for (var i=0; i<weekdays.length; ++i) {
      updateHighlightingAndTablesForOneDay(weekdays[i]);
    }
  } else {
    updateHighlightingAndTablesForOneDay(day);
  }
}

function deleteWholeCar(day, driver) {
  delete cars[day][driver];
  changedPage = true;
  updateHighlightingAndTables(day);
}

function deleteCar(day, driver, halfday) {
  delete cars[day][driver][halfday];
  var tableNowEmpty = true;
  for (var otherHalfdays in cars[day][driver]) {
    tableNowEmpty = false;
    break;
  }
  if (tableNowEmpty) {
    delete cars[day][driver];
  }
  changedPage = true;
  updateHighlightingAndTables(day);
}

function updateHighlightingAndTablesForOneDay(day) {
  // Get every person's row for that day
  var personRows = document.querySelectorAll("table.timetable[day="+day+"] .timeview ");

  for (var personRowIdx=0; personRowIdx<personRows.length; ++personRowIdx) {
    var row = personRows[personRowIdx];
    var email = row.getAttribute('email');
    var halfday = row.parentNode.parentNode.getAttribute('halfday');
    var otherhalfday = halfday == 'AM'? 'PM' : 'AM';

    // Figure out if the person is in a car for that day 
    var inCar = false; // Already assigned for this halfday
    var carstatus = "unassigned"; // Assignment (driver, passenger) for the full day
    if (cars[day][email]) {
      carstatus = "driver";
      if (cars[day][email][halfday]) {
        inCar = true;
      }
    } else {
      var passTime = isPassengerForDay(day, email);
      if (passTime) {
        carstatus = 'passenger';
        if (passTime == 'both' || passTime == halfday) {
          inCar = true;
        }
      }
    }
    row.setAttribute('inCar', inCar);
    row.setAttribute('carstatus', carstatus);

    // Now clear out the click-highlighting
    var tds = row.getElementsByTagName('td');
    for (var tdIdx=0; tdIdx<tds.length; ++tdIdx) {
      var td = tds[tdIdx];
      if (td.className != 'name') {
        td.setAttribute('carstatus', false);
      }
    }
  }


  document.getElementById(day+'Cars').innerHTML = "";
  for (var driver in cars[day]) {
    document.getElementById(day+'Cars').appendChild(makeCarTable(allPreferences, cars, day, driver, false, true, null));
  }
}


//This function is called by the finish car button and
//adds a new car to the car list.
function makeCar(day){
  // Check to see the overide box is checked and reset it
  //var overrideButton = document.getElementById(day+'Override');
  //var override = overrideButton.checked;
  var override = false;
  //overrideButton.checked = false;

  // Get a list of the time tables and select the am and pm tables we are
  // interested in.
  var tablesForDay = document.querySelectorAll("table.timetable[day="+day+"]");

  // Emails of driver and passengers
  var driver = undefined;
  var passengers = [];
  var time = undefined;
  var halfday = undefined;

  // Variable to do with error checking
  //var trOfCar = [];
  var carError = false;
  var errorString = 'While you were trying to make a car there were the following errors: \n';

  // Do the following search and creation for both the am and pm tables
  for(var halfdayIdx = 0; halfdayIdx < tablesForDay.length; ++halfdayIdx){
    var currTable = tablesForDay[halfdayIdx];
    var thishalfday = ['AM', 'PM'][halfdayIdx];
    // Go through the am table and split it apart into each form submision
    var trs = currTable.getElementsByClassName('timeview');
    for (var trIdx=0; trIdx<trs.length; ++trIdx) {
      var tr = trs[trIdx];

      var email = tr.getAttribute('email');

      var driveStatuses = tr.getElementsByClassName('driveStatus');
      var driveRestriction = undefined;
      if (driveStatuses.length == 1) {
        driveRestriction = driveStatuses[0].innerHTML;
      }

      // Get the entries for this submision
      var tds = tr.getElementsByTagName('td');

      // We can start at 1 because the first entry is a name
      for (var tdIdx = 1; tdIdx < tds.length; ++tdIdx){
        var td = tds[tdIdx];
        var carstatus = td.getAttribute('carstatus');
        if (carstatus == 'driver' || carstatus == 'passenger') {

          //if there is no time currently then change it, otherwise make
          //sure the times are the same
          if (!time) {
            time = td.getAttribute('time');
          } else if (time != td.getAttribute('time')) {
            carError = true;
            errorString = errorString.concat('You entered multiple times for one car. \n');
          }

          if (!halfday) {
            halfday = thishalfday;
          } else if (halfday != thishalfday) {
            carError = true;
            errorString = errorString.concat('You entered multiple halfdays for one car.\n');
          }

          if (carstatus == 'driver') {
            if (driver) {
              errorString = errorString.concat('You picked two drivers. \n');
              carError = true;
            }
            if (driveRestriction == 'cannot drive') {
              errorString = errorString.concat('You made someone a driver who cannot drive that day. \n');
              carError = true;
            }
            if (isPassengerForDay(day, email)) {
              carError = true;
              errorString = errorString.concat('You made someone a driver who is already a passenger going the other way. \n');
            }

            driver = email;
          } else if (carstatus == 'passenger') {
            if (driveRestriction == 'must drive') {
              carError = true;
              errorString = errorString.concat('You made someone a passenger who must drive that day. \n');
            }
            if (cars[day][email]) {
              carError = true;
              errorString = errorString.concat('You made someone a passenger who is already a driver going the otherway. \n');
            }

            passengers.push(email);
          }

          // Check if the person is already in a car.
          if(tr.getAttribute('inCar') == 'true'){
            errorString = errorString.concat('One of those people is already in a car.\n');
            carError = true;
          }
        }
      }
    }
  }

  //Check if the drive string is still empty. In this case let the user know that they
  //forgot to add a driver.
  if(!driver){
    carError = true;
    errorString = errorString.concat('you did not select a driver. \n');
  }
  //Check if there is a car error, in which case notify the user change the
  //in car status of all the passengers and exit the function
  if(carError && !override){
    window.alert(errorString);
    return;
  }

  // There's no errors! We can continue merrily

  if (!cars[day][driver]) {
    cars[day][driver] = {};
  }
  if (!cars[day][driver][halfday]) {
    cars[day][driver][halfday] = {};
  }

  cars[day][driver][halfday].time = time;
  cars[day][driver][halfday].passengers = passengers;

  changedPage = true;
  updateHighlightingAndTables(day);
}

function submitCars() {
  changedPage = false;
  document.getElementById('allCars').value = JSON.stringify(cars);
  //new cars 

}

passengerName = ""
ampm = ""
driverStatusStr = ""
/*
* Drag start is called when you start dragging the table row
* Sets the global var passengerName to the name of the person 
*   being dragged
*/
function dragStart(event,name, ampmstring, driverStatus){
  passengerName = name;
  ampm = ampmstring;
  driverStatusStr = driverStatus
  //alert(driverStatus);
}

// global variables for keeping track of cars 
var count = 0;
var carsArray = new Array();


// author: edorsey, tstannard
// Makes a car box
function makeCarBox(day) {
  //put car in the backend 
  var car_json = {};
  car_json["driver"] = "";
  var am_car = {};
  am_car["time"] = 0;
  am_car["passengers"] = [];
  var pm_car = {};
  pm_car["time"] = 0;
  pm_car["passengers"] = [];
  
  car_json["AM"] = am_car;
  car_json["PM"] = pm_car;

  console.log(car_json);
  cars[day][count] = car_json;
  console.log(cars);

  // create the car box div
  var carBox = document.createElement('div');
  carBox.className = 'boxed';
  carBox.id = count.toString();

  // create close button for each car
  var closeButton = document.createElement('button');
  closeButton.className = 'boxclose';

  // onClick we remove the car
  closeButton.setAttribute("onClick", "parentNode.remove()");

  carBox.appendChild(closeButton);

  // car text
  var carText = document.createElement('div');
  var carTextID =  count.toString() + day + "text";
  carText.id =  carTextID;
  var content = document.createTextNode("This is car number " + count + " and it is for " + day);

  //content.className = 'boxed';
  carText.appendChild(content);
  carBox.appendChild(carText);

  var driverText = document.createElement('div');
  var carDriverID = count.toString() + day + "driver";
  driverText.id = carDriverID;
  var content = document.createTextNode("Driver: please select a driver");
  driverText.appendChild(content);

  carBox.appendChild(driverText);

  // am box
  var amDiv = document.createElement('div');
  var amText = document.createTextNode("Drop AM passengers here");
  amDiv.appendChild(amText);
  amDiv.className = "amContainer";
  amDiv.setAttribute("ondragover", "allowDrop(event)");
  amDiv.id = count.toString() + day + "AM";
  
  // on drop we make a list of radio elements and add passengerName to amDiv
  amDiv.ondrop = function(event) {
    //alert(JSON.stringify(cars[day][carBox.id].AM));
    if(ampm == "PM"){
      alert("You tried to add a PM passenger to an AM spot.");}
    else{
      event.preventDefault();

      //add person in backend - update to email soon 
      cars[day][carBox.id].AM.passengers.push(passengerName);
      countID = carBox.id;
      dayVar = day;

      // personName and radio buttons go under label element
      var label = document.createElement('label');
      label.className = "radioLabel";
      var listEl = document.createElement('input');
      listEl.setAttribute("type", "radio");
      var amID = amDiv.id;
      listEl.setAttribute("name", amID);
      listEl.setAttribute("value", passengerName);
      listEl.setAttribute("textContent", passengerName);
      listEl.setAttribute("style", "margin: 0 3px 0 3px");

       // personName and radio buttons go under label element
      var label = document.createElement('label');
      label.className = "radioLabel";
      var listEl = document.createElement('input');
      listEl.setAttribute("type", "radio");
      listEl.setAttribute("onChange", "handleChange(this, elID, countID, dayVar)")
      var amID = amDiv.id;
      listEl.setAttribute("name", amID);
      listEl.setAttribute("value", passengerName);
      listEl.setAttribute("textContent", passengerName);
      listEl.setAttribute("style", "margin: 0 3px 0 3px ");

      // append radio button and passengerName text
      var dropText = document.createTextNode(passengerName);
      label.appendChild(listEl);
      label.appendChild(dropText);

      //append removePersonButton to label
      var removePersonButton = document.createElement('button');
      removePersonButton.className = 'removePersonButton';
      removePersonButton.setAttribute("onClick", "parentNode.remove()");
      label.appendChild(removePersonButton);

      // append the list element to the amDiv
      amDiv.appendChild(label);

      //alert(driverStatusStr);

      // if(this.getAttribute('selected') == 'true'){
      //       if (this.getAttribute('carstatus') == 'passenger'){
      //         this.setAttribute('carstatus', 'driver');
      //       } else if (this.getAttribute('carstatus') == 'driver'){
      //         this.setAttribute('carstatus', 'unassigned');
      //       } else{
      //         this.setAttribute('carstatus', 'passenger');
      //       }
    }
  };

  // add amDiv to the car box
  carBox.appendChild(amDiv);

  // repeat above with pm box
  var pmDiv = document.createElement('div');
  var pmText = document.createTextNode("Drop PM passengers here");
  pmDiv.appendChild(pmText);
  pmDiv.className = "pmContainer";
  pmDiv.setAttribute("ondragover", "allowDrop(event)");
  pmDiv.id = count.toString() + day + "PM";

  // on drop, we make a label and add passengerName text and radio button
  pmDiv.ondrop = function(event) {
    elID = carDriverID;
     if(ampm == "AM"){
      alert("You tried to add an AM passenger to a PM spot.");}
    else{
      event.preventDefault();

      //add person in backend - update to email soon 
      cars[day][carBox.id].PM.passengers.push(passengerName);
      countID = carBox.id;
      dayVar = day;
      
      // personName and radio buttons go under label element
      var label = document.createElement('label');
      label.className = "radioLabel";
      var listEl = document.createElement('input');
      listEl.setAttribute("type", "radio");
      listEl.setAttribute("onChange", "handleChange(this, elID, countID, dayVar)")
      var pmID = pmDiv.id;
      listEl.setAttribute("name", pmID);
      listEl.setAttribute("value", passengerName);
      listEl.setAttribute("textContent", passengerName);
      listEl.setAttribute("style", "margin: 0 3px 0 3px ");

      // append radio button and passengerName text
      var dropText = document.createTextNode(passengerName);
      label.appendChild(listEl);
      label.appendChild(dropText);
      
      //append removePersonButton to label
      var removePersonButton = document.createElement('button');
      removePersonButton.className = 'removePersonButton';
      removePersonButton.setAttribute("onClick", "parentNode.remove()");
      label.appendChild(removePersonButton);

      // append the list element to the amDiv
      pmDiv.appendChild(label);
    }
  };

  // add the pmDiv to the car box
  carBox.appendChild(pmDiv);

  var finishCarButton = document.createElement('button');
  finishCarButton.className = 'finishCarButton';
  //finishCarButton.setAttribute("onClick", "finishCar(carsArray)");
  carBox.appendChild(finishCarButton);

  // add the car box to its day div
  var d = document.getElementById( day );
  d.appendChild( carBox );

  count++;
}

function handleChange(myRadio, elID, boxID, day){
  content = 'The driver is: ' + myRadio.value;
  document.getElementById(elID).innerHTML = content;

  alert(day);

  cars[day][boxID].driver = myRadio.value;
}

function finishCar(carsArray){
  //curretnly will allert the TOTAL number of cars minus 1
  alert(carsArray[carsArray.length - 1]);
}
// author: edorsey,tstannard
// this needs to be here
function allowDrop(event) {
    event.preventDefault();
}


//This is a helper function which parses a time into a viuallly apealling
//and uniform way
function parseTime(time){
  //Get rid of the first part which has the day.

  var timeString = time.split('y')[1]

  //save the AM vs PM
  var endOfTime = timeString.substring(0,2)

  //make the time with a colon in it. We need seperate cases for when
  //we have 4 digits vs 3 digits of time.
  if (timeString.length == 5){
    var startOfTime = timeString.substring(2,3).concat(':')
    startOfTime = startOfTime.concat(timeString.substring(3))

    //add a space for astetic
    startOfTime = startOfTime.concat(' ')
  }else{
    var startOfTime = timeString.substring(2,4).concat(':')
    startOfTime = startOfTime.concat(timeString.substring(4))

    //add a space for astetic
    startOfTime = startOfTime.concat(' ')
  }

  return startOfTime.concat(endOfTime)
}

function populateModifyCarsModal() {
  document.getElementById('directModifyJSONInput').value = JSON.stringify(cars, null, 2);
}

function saveDirectCarModifyChanges() {
  var value;
  try {
    value = JSON.parse(document.getElementById('directModifyJSONInput').value);
  } catch(e) {
    alert("JSON parse error: " + e);
    return;
  }

  // Save it and close the modal
  cars = value;
  $('#directModifyJSON').modal('hide')
  changedPage = true;
  updateHighlightingAndTables();
}

// Converts a gmail, name, or preferred email to their gmail
// Uses allPreferences
function aliasToEmail(alias) {
  if (alias in allPreferences) {
    return alias;
  } else {
    // They must have given a name or a "preferred email" instead of their
    // gmail
    for (var person in allPreferences) {
      var theirPreferences = allPreferences[person];
      if (theirPreferences.prefEmail == alias
          || theirPreferences.name.toLowerCase() == alias.toLowerCase()) {
        return person;
      }
    }
  }
}
function directlyAddCar(day) {
  // Get the modal
  var theForm = document.getElementById('directAddCar'+day);

  // In the modal, get the different fields
  var driver = aliasToEmail(theForm.getElementsByClassName('driver')[0].value);
  var amtime = theForm.getElementsByClassName('AMtime')[0].value;
  var pmtime = theForm.getElementsByClassName('PMtime')[0].value;
  var amPassengerInputs = theForm.getElementsByClassName('AMpassenger');
  var pmPassengerInputs = theForm.getElementsByClassName('PMpassenger');

  // Get the list of passengers
  var amPassengers = [];
  for (var i=0; i<amPassengerInputs.length; ++i) {
    var p = amPassengerInputs[i].value;
    if (!p) continue;
    amPassengers.push(aliasToEmail(p));
  }
  var pmPassengers = [];
  for (var i=0; i<pmPassengerInputs.length; ++i) {
    var p = pmPassengerInputs[i].value;
    if (!p) continue;
    pmPassengers.push(aliasToEmail(p));
  }

  // Change the times to the right format
  amtime = parseInt(amtime.slice(0,2), 10).toString() + amtime.slice(amtime.length-2);
  pmHour = parseInt(pmtime.slice(0,2), 10);
  if (pmHour > 12) {
    pmHour -= 12;
  }
  pmtime = pmHour.toString() + pmtime.slice(pmtime.length-2);

  // Clear the form!
  document.getElementById('directAddForm'+day).reset();

  // Add the car
  cars[day][driver] = {
    AM: {time: amtime, passengers: amPassengers},
    PM: {time: pmtime, passengers: pmPassengers}
  };
  changedPage = true;
  updateHighlightingAndTables(day);
}

function directlyAddCarClear(day) {
  var theForm = document.getElementById('directAddForm'+day);
  theForm.reset();
}

window.addEventListener("beforeunload", function (e) {
  if (changedPage) {
    var confirmationMessage = "You have unsaved cars!";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }
});

