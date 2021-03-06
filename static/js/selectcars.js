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

window.onload = function(peopleDataInput) 
{
  var peopleData = peopleDataInput;
  var timeResults = document.getElementById("timeResults");

  var h3s = timeResults.getElementsByTagName("h3");
  
  for (var h3idx=0; h3idx<h3s.length; h3idx +=2) 
  {
    var day = h3s[h3idx].textContent;
    weekdays.push(day);
    cars[day] = {};
  }

  //Checks if the time tables are clicked and responds accordingly
  var timetables = timeResults.getElementsByClassName("timetable");
  for (var timetableidx=0; timetableidx<timetables.length; ++timetableidx)
  {
    var ti = timetables[timetableidx];
    var tds = ti.getElementsByTagName("td");

    for (var tdIdx=0; tdIdx<tds.length; ++tdIdx) 
    {
      var td = tds[tdIdx];

      if (td.getAttribute('selected')) 
      {
        td.onmouseover = function() 
        {
          this.setAttribute('mousedover', 'true');
        }

        td.onmouseleave = function() 
        {
          this.setAttribute('mousedover', 'false');
        }

        //This needs to be here - So that you can click one someone 
        //Pasengers
        td.onclick = function(){}
      }
    }
  }
  updateHighlightingAndTables();
}

$(document).ready(function()
{
    $('[data-toggle="popover"]').popover();
}
);

// Returns 'AM' or 'PM' or 'both' if they are a passenger or null if they are a
// driver or not yet assigned
function isPassengerForDay(day, email)
{
  var numFound = 0;
  var foundHalfday;
  
  for (var otherdriveremail in cars[day]) 
  {
    
    for (var halfdayIdx=0; halfdayIdx<2; ++halfdayIdx) 
    {
      var halfday = ['AM', 'PM'][halfdayIdx];
      var hd = cars[day][otherdriveremail][halfday];
      
      if (hd) 
      {
        
        for (var i=0; i<hd.passengers.length; ++i) 
        {
          
          if (hd.passengers[i] == email) 
          {
            ++numFound;
            foundHalfday = halfday;
          }
        }
      }
    }

    if (numFound == 2) 
    {
      return 'both';
    }
  }

  if (numFound == 1) 
  {
    return foundHalfday;
  }
  
  return null;
}

function updateHighlightingAndTables(day) 
{
  if (day === undefined) 
  {
    
    for (var i=0; i<weekdays.length; ++i) 
    {
      updateHighlightingAndTablesForOneDay(weekdays[i]);
    }
  }  
  else 
  {
    updateHighlightingAndTablesForOneDay(day);
  }
}

function updateHighlightingAndTablesForOneDay(day) 
{
  // Get every person's row for that day
  var personRows = document.querySelectorAll("table.timetable[day="+day+"] .timeview ");

  for (var personRowIdx=0; personRowIdx<personRows.length; ++personRowIdx) 
  {
    var row = personRows[personRowIdx];
    var email = row.getAttribute('email');
    var halfday = row.parentNode.parentNode.getAttribute('halfday');
    var otherhalfday = halfday == 'AM'? 'PM' : 'AM';

    // Figure out if the person is in a car for that day 
    var inCar = false; // Already assigned for this halfday
    var carstatus = "unassigned"; // Assignment (driver, passenger) for the full day

    if (cars[day][email]) 
    {
      carstatus = "driver";
      if (cars[day][email][halfday])
      {
        inCar = true;
      }
    } 
    else 
    {
      var passTime = isPassengerForDay(day, email);

      if (passTime) 
      {
        carstatus = 'passenger';

        if (passTime == 'both' || passTime == halfday) 
        {
          inCar = true;
        }
      }
    }

    row.setAttribute('inCar', inCar);
    row.setAttribute('carstatus', carstatus);

    // Now clear out the click-highlighting
    var tds = row.getElementsByTagName('td');

    for (var tdIdx=0; tdIdx<tds.length; ++tdIdx) 
    {
      var td = tds[tdIdx];

      if (td.className != 'name') 
      {
        td.setAttribute('carstatus', false);
      }
    }
  }

  document.getElementById(day+'Cars').innerHTML = "";
  var car = cars[day];

  for (var driver in cars[day])
  {
    document.getElementById(day+'Cars').appendChild(makeCarTable(allPreferences, car, day, false, true, null));
  }
}

function submitCars()
{
  changedPage = false;
  document.getElementById('allCars').value = JSON.stringify(cars);
}

//global variables used for drag and drop 
var passengerName = ""
var ampm = ""
var passengerEmail = ""
var passengerDay = "" 

var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

//object of person data which is reference to where i want to go 
/*
* Drag start is called when you start dragging the table row
* Sets the global var passengerName to the name of the person 
*   being dragged
*/
function dragStart(event, name, ampmstring, email, day)
{
  passengerName = name;
  ampm = ampmstring;
  passengerEmail = email;
  passengerDay = day; 
}

// global variables for keeping track of cars 
var count = 0;
var carsArray = new Array();


// authors: edorsey, tstannard
// Makes a car box - also handles how people are dropped in 
function makeCarBox(day) 
{
  //put car in the backend using a JSON object
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

  cars[day][count] = car_json;

  // create the car box div
  var carBox = document.createElement('div');
  carBox.className = 'boxed';
  var carBoxID = count.toString();
  carBox.id = carBoxID;

  // create close button for each car
  var closeButton = document.createElement('button');
  closeButton.className = 'boxclose';

  // onClick of the close button we remove the car
  closeButton.setAttribute("onClick", "deleteCarOnX(" + carBoxID +", \'" + day + "\'" + ")");

  // put the button in the div
  carBox.appendChild(closeButton);

  // car text
  var carText = document.createElement('div');
  var carTextID =  count.toString() + day + "text";
  carText.id =  carTextID;
  var content = document.createTextNode("This is car number " + count + " and it is for " + day);

  //content.className = 'boxed';
  carText.appendChild(content);
  carBox.appendChild(carText);


  // driver info div 
  var driverText = document.createElement('div');
  var carDriverID = count.toString() + day + "driver";
  driverText.id = carDriverID;
  var content = document.createTextNode("Driver: please select a driver");
  driverText.appendChild(content);

  carBox.appendChild(driverText);

  // am box
  var amDiv = document.createElement('div');

  var amTimeDiv = document.createElement('input');
  amTimeDiv.setAttribute("type", "time");
  amTimeDiv.id = count + "AMtime";
  amTimeDiv.className = "timeInput";
  amDiv.appendChild(amTimeDiv);

  var amText = document.createTextNode("Drop AM passengers here");
  amDiv.appendChild(amText);
  amDiv.className = "amContainer";
  amDiv.setAttribute("ondragover", "allowDrop(event)");
  amDiv.id = count.toString() + day + "AM";
  
  // drop function is implicitly defined here
  // this means if you edit the drop, you must also do the same edits on 
  // the PM drop 
  amDiv.ondrop = function(event) 
  {
     var tooMany;

     if(ampm == "PM")
     {
      alert("You tried to add an PM passenger to a AM spot.");
     }
     else 
     {
        tooMany = checkAlreadyAdded(amDiv, "AM", passengerEmail, day);
        
        if (tooMany == true) 
        {
          alert("This person already has a AM ride!");
        } 
        else 
        {
          event.preventDefault();

          //add person in backend
          cars[day][carBox.id].AM.passengers.push(passengerEmail);
          countID = carBox.id;
          dayVar = day;

          // use day, ampm, and email to get persons data 
          var dayIndex = 2*daysArray.indexOf(day) ;
          var ampmTable = document.getElementsByClassName("titleTable")[dayIndex];
          var tableRows = ampmTable.getElementsByTagName('tr');
          var row = tableRows[0];
          var tableRowIndex = 0;

          // find the table row of the passenger 
          for(var index = 0; index < tableRows.length; ++index)
          {
            if(tableRows[index].getAttribute('email') == passengerEmail)
            {
              row = tableRows[index];
              tableRowIndex = index;
            }
          }

          row.setAttribute('carstatus', 'passenger');
          
          // personName and radio buttons go under label element
          var label = document.createElement('label');
          label.className = "radioLabel";
          label.id = "radioLabel" + passengerName + "AM";
          var labelID = label.id.toString();
          var listEl = document.createElement('input');
          listEl.setAttribute("type", "radio");
          listEl.setAttribute("onChange", "handleChange(this)")
          var amID = amDiv.id;
          listEl.setAttribute("name", amID);
          listEl.setAttribute("value", passengerName);
          listEl.setAttribute("textContent", passengerName);
          listEl.setAttribute("style", "margin: 0 3px 0 3px");

          // append radio button and passengerName text
          var dropText = document.createTextNode(passengerName);
          label.appendChild(listEl);
          label.appendChild(dropText);
          
          //append removePersonButton to label
          var removePersonButton = document.createElement('button');
          removePersonButton.className = 'removePersonButton';
          
          var currentEmail = passengerEmail;

          var temp = "AM";

          removePersonButton.setAttribute("onClick", "deletePersonOnX(\'" + currentEmail + "\'" + ", " + 
          dayIndex + ", " + "\'" + day + "\'" + ", " + "\'" + temp + "\'" + ", " + tableRowIndex + ", \'" + labelID + "\', \'" + 
          carBox.id + "\')");

          label.appendChild(removePersonButton);      

          // append the list element to the amDiv
          amDiv.appendChild(label);
          }
      }
    };

    // add amDiv to the car box
    carBox.appendChild(amDiv);

    // repeat above with pm box
    var pmDiv = document.createElement('div');
    var pmTimeDiv = document.createElement('input');
    pmTimeDiv.setAttribute("type", "time");
    pmTimeDiv.id = count + "PMtime";
    pmTimeDiv.className = "timeInput";
    pmDiv.appendChild(pmTimeDiv);
    var pmText = document.createTextNode("Drop PM passengers here");
    pmDiv.appendChild(pmText);
    pmDiv.className = "pmContainer";
    pmDiv.setAttribute("ondragover", "allowDrop(event)");
    pmDiv.id = count.toString() + day + "PM";

    // on drop, we make a label and add passengerName text and radio button
    // ondrop is implicitly defined, so if you make a change be sure to update 
    // the AM ondrop as well 
    pmDiv.ondrop = function(event) 
    {
      var tooMany;

      if(ampm == "AM")
      {
        alert("You tried to add an AM passenger to a PM spot.");
      }

      else 
      {
      tooMany = checkAlreadyAdded(pmDiv, "PM", passengerEmail, day);

      if (tooMany == true) 
      {
        alert("This person already has a PM ride!");
      }

      else
      {
        event.preventDefault();

        //add person in backend 
        cars[day][carBox.id].PM.passengers.push(passengerEmail);
        countID = carBox.id;
        dayVar = day;

        // use day, ampm, and email to get persons data 
        var dayIndex = 2*daysArray.indexOf(day) +1;

        var dayIndexString = dayIndex.toString();

        var ampmTable = document.getElementsByClassName("titleTable")[dayIndex];
        var tableRows = ampmTable.getElementsByTagName('tr');
        var row = tableRows[0];
        var tableRowIndex = 0;

        // find the table row of the passenger 
        for(var index = 0; index < tableRows.length; ++index)
        {
          if(tableRows[index].getAttribute('email') == passengerEmail)
          {
            row = tableRows[index];
            tableRowIndex = index;
          }
        }

        row.setAttribute('carstatus', 'passenger');
        
        // personName and radio buttons go under label element
        var label = document.createElement('label');
        label.className = "radioLabel";
        label.id = "radioLabel" + passengerName + "PM";
        var labelID = label.id.toString();
        var listEl = document.createElement('input');
        listEl.setAttribute("type", "radio");
        listEl.setAttribute("onChange", "handleChange(this)")
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

        var currentEmail = passengerEmail;

        var temp = "PM";

        removePersonButton.setAttribute("onClick", "deletePersonOnX(\'" + currentEmail + "\'" + ", " + 
        dayIndex + ", " + "\'" + day + "\'" + ", " + "\'" + temp + "\'" + ", " + tableRowIndex + ", \'" + labelID + "\', \'" + 
        carBox.id + "\')");

        label.appendChild(removePersonButton);

        // append the list element to the amDiv
        pmDiv.appendChild(label);

      }
    }
  };

  // add the pmDiv to the car box
  carBox.appendChild(pmDiv);

  var finishCarButton = document.createElement('button');
  var temp = carBoxID + "finishButton";
  finishCarButton.id = temp;
  finishCarButton.innerHTML = "Finish Car";
  finishCarButton.className = 'finishCarButton';
  finishCarButton.setAttribute("onClick", "finishCar(\'" + carBoxID + "\', \'" + day + "\')");
  carBox.appendChild(finishCarButton);

  // add the car box to its day div
  var d = document.getElementById( day );
  d.appendChild( carBox );

  count++;
}

var mondayAM = [];
var mondayPM = [];
var tuesdayAM = [];
var tuesdayPM = [];
var wednesdayAM = [];
var wednesdayPM = [];
var thursdayAM = [];
var thursdayPM = [];
var fridayAM = [];
var fridayPM = [];

function checkAlreadyAdded(pmDiv, amPM, passengerEmail, day) 
{

  var currCount = pmDiv.parentNode.id;

  var inList;

  if (amPM == "AM") {
    if (day == "Monday") {
      inList = checkIfInList(mondayAM, passengerEmail);
    } else if (day == "Tuesday") {
      inList = checkIfInList(tuesdayAM, passengerEmail);
    } else if (day == "Wednesday") {
      inList = checkIfInList(wednesdayAM, passengerEmail);
    } else if (day == "Thursday") { 
      inList = checkIfInList(thursdayAM, passengerEmail);
    } else {
      inList = checkIfInList(fridayAM, passengerEmail);
    }
  } else {
    if (day == "Monday") {
      inList = checkIfInList(mondayPM, passengerEmail);
    } else if (day == "Tuesday") {
      inList = checkIfInList(tuesdayPM, passengerEmail);
    } else if (day == "Wednesday") {
      inList = checkIfInList(wednesdayPM, passengerEmail);
    } else if (day == "Thursday") {
      inList = checkIfInList(thursdayPM, passengerEmail);
    } else {
      inList = checkIfInList(fridayPM, passengerEmail);
    }
  }
  return inList;
}

function checkIfInList(dayList, email) 
{
    var listLength=dayList.length;

    for(var i=0; i<listLength; i++)
    {
        // if its in the array, return true
        if(dayList[i] == email)
        {
          return true;
        }
    }
    // if not, then add to list and return false
    dayList.push(email);
    return false;
}

function removeFromPassengerList(email, day, amPM)
{

    if (amPM == "AM") {
    if (day == "Monday") {
      dayList = mondayAM;
    } else if (day == "Tuesday") {
      dayList = tuesdayAM;
    } else if (day == "Wednesday") {
      dayList = wednesdayAM;
    } else if (day == "Thursday") { 
      dayList = thursdayAM;
    } else {
      dayList = fridayAM;
    }
  } else {
    if (day == "Monday") {
      dayList = mondayPM;
    } else if (day == "Tuesday") {
      dayList = tuesdayPM;
    } else if (day == "Wednesday") {
      dayList = wednesdayPM;
    } else if (day == "Thursday") {
      dayList = thursdayPM;
    } else {
      dayList = fridayPM;
    }
  }

    var listLength=dayList.length;

    for(var i=0; i<listLength; i++)
    {
        // if its in the array, return true
        if(dayList[i] == email)
        {
          dayList.splice(i);
        }
    }
}

function handleChange(myRadio)
{
  var radioID = myRadio.id;
  var countNum = myRadio.parentElement.parentElement.parentElement.id;
  var day1 = myRadio.parentElement.parentElement.parentElement.parentElement.id;

  //go through the am array to see if they car drive 
  var dayIndex = 2*daysArray.indexOf(day1);
  var ampmTable = document.getElementsByClassName("titleTable")[dayIndex];
  var tableRows = ampmTable.getElementsByTagName('tr');
  var row = tableRows[0];
  var tableRowIndex = 0;
  // find the table row of the passenger 
  for(var index = 0; index < tableRows.length; ++index)
  {
    if(tableRows[index].getAttribute('email') == passengerEmail)
    {
      row = tableRows[index];
      tableRowIndex = index;
    }
  }

  var driverEmail = aliasToEmail(myRadio.value);
  var inAM = false;
  passengerAMList = cars[day1][countNum].AM.passengers; 

  for (var i=0; i<passengerAMList.length; ++i)
  {
    if(driverEmail == passengerAMList[i])
    {
        inAM = true;
    }
  } 

  var inPM = false;
  passengerPMList = cars[day1][countNum].PM.passengers;
  for (var i=0; i<passengerPMList.length; ++i)
  {
    if(driverEmail == passengerPMList[i])
    {
        inPM = true;
    }
  } 

  if(inAM == false || inPM == false)
  {
    alert("Please add the driver to the AM and the PM of the car");
    myRadio.checked = false;
  }

  else
  {
    var driveStatuses = row.getElementsByClassName('driveStatus');

    if(driveStatuses.length ==1 && driveStatuses[0].innerHTML == "cannot drive")
    {
      alert("You tried to make someone a driver who can not drive. \n Please select a new driver.");
      myRadio.checked = false;
    }

    else
    {
      content = 'The driver is: ' + myRadio.value;
      driverID = countNum.toString() + day1 + "driver";

      document.getElementById(driverID).innerHTML = content;

      cars[day1][countNum].driver = aliasToEmail(myRadio.value);
    }
  }
}

function finishCar(carID,day)
{

  // will tell button text to change if there are no errors
  var error = 0;

  var amTime = document.getElementById(carID+"AMtime").value
  var pmTime = document.getElementById(carID+"PMtime").value

  cars[day][carID].AM.time = amTime;
  cars[day][carID].PM.time = pmTime;

  // check if driver is blank
  if (cars[day][carID].driver == "")
  {
    alert("Plese select a driver before you finish the car.");
    error++;
  } 

  // check if AM time is blank
  if(cars[day][carID].AM.time == "")
  {
    alert("Please add an AM time.");
    error++;
  }

  // check if PM time is blank
  if(cars[day][carID].PM.time == ""){
    alert("Please add a PM time.");
    error++;
  } 

  // if driver and time are not blank update the backend 
  else 
  {
    var numPassengersAM = cars[day][carID].AM.passengers.length;
    var numPassengersPM = cars[day][carID].PM.passengers.length;
    var carSize = allPreferences[cars[day][carID].driver].numPassengers;

    if(carSize < numPassengersAM & carSize < numPassengersPM) 
    {
      error++;
      alert("You have added too many passengers in both the AM and PM! " +
      allPreferences[cars[day][carID].driver].name + " has only " + carSize + " seat(s).");
    }

    else if(carSize < numPassengersAM) 
    {
      error++;
      alert("You have added too many AM passengers! " +
      allPreferences[cars[day][carID].driver].name + " has only " + carSize + " seat(s).");
    }

    else if(carSize < numPassengersPM) 
    {
      error++;
      alert("You have added too many PM passengers! " +
      allPreferences[cars[day][carID].driver].name + " has only " + carSize + " seat(s).");
    }
  }

  var buttonID = carID + "finishButton";
  var finishButton = document.getElementById(buttonID);

  if(error == 0 && finishButton.innerHTML == "Finish Car")
  {
    finishButton.innerHTML = "Edit Car";
    document.getElementById(carID).style.background = "#cccccc";
  }

  else 
  {
    finishButton.innerHTML = "Finish Car";
    document.getElementById(carID).style.background = "#eee8f3";
  }
}

// author: edorsey,tstannard
// this needs to be here
function allowDrop(event) {
    event.preventDefault();
}

// remove the car from the front end and the back end 
function deleteCarOnX(carID, day) 
{
  var day = document.getElementById(carID).parentElement.id;

  //change all the passenger status's 
  passengerAMList = cars[day][carID].AM.passengers; 

  for(i = 0; i < passengerAMList.length; i++)
  {
    removeFromPassengerList(passengerAMList[i], day, "AM");
  }

  var dayIndexAM = 2*daysArray.indexOf(day);
  var ampmTableAM = document.getElementsByClassName("titleTable")[dayIndexAM];
  var tableRowsAM = ampmTableAM.getElementsByTagName('tr');
  var rowAM = tableRowsAM[0];

  for (var i=0; i<passengerAMList.length; ++i)
  {
      // find the table row of the passenger 
      var amEmail = passengerAMList[i];

      for(var index = 0; index < tableRowsAM.length; ++index)
      {
        if(tableRowsAM[index].getAttribute('email') == amEmail)
        {
          tableRowsAM[index].setAttribute('carstatus', 'false')
        }
      } 
   }
   
   passengerPMList = cars[day][carID].PM.passengers; 
   for(a = 0; a < passengerPMList.length; a++)
   {
     //alert(passengerAMList[a]);
     removeFromPassengerList(passengerPMList[a], day, "PM");
    }

    dayIndexPM = 2*daysArray.indexOf(day) +1;
    ampmTablePM = document.getElementsByClassName("titleTable")[dayIndexPM];
    var tableRowsPM = ampmTablePM.getElementsByTagName('tr');
    var rowPM = tableRowsPM[0];

    for (var i=0; i<passengerPMList.length; ++i)
    {
      // find the table row of the passenger 
      var pmEmail = passengerPMList[i];

      for(var index = 0; index < tableRowsPM.length; ++index)
      {
        if(tableRowsPM[index].getAttribute('email') == pmEmail)
        {
          tableRowsPM[index].setAttribute('carstatus', 'false')
        }
      } 
    }

  document.getElementById(carID).remove();
  delete cars[day][carID];
}

function deletePersonOnX(email, dayIndex, day, ampm, rowIndex, listEl, currentID) 
{
  // delete front end 
  document.getElementById(listEl).remove();

  //use day, ampm, and email to get/changes persons car status  
  var ampmTable = document.getElementsByClassName("titleTable")[dayIndex];
  var tableRows = ampmTable.getElementsByTagName('tr');
  var row = tableRows[rowIndex];
  row.setAttribute('carstatus', 'false');

  // remove from backend
  if(dayIndex%2 == 0)
  {
    var passengerIndex = cars[day][currentID].AM.passengers.indexOf(email);
    cars[day][currentID].AM.passengers.splice(passengerIndex);
  }

  else
  {
    var passengerIndex = cars[day][currentID].PM.passengers.indexOf(email);
    cars[day][currentID].PM.passengers.splice(passengerIndex);
  }
  removeFromPassengerList(email, day, ampm);
}

//This is a helper function which parses a time into a viuallly apealling
//and uniform way
function parseTime(time){

  //Get rid of the first part which has the day.
  var timeString = time.split('y')[1]

  //save the AM vs PM
  var endOfTime = timeString.substring(0,2);

  //make the time with a colon in it. We need seperate cases for when
  //we have 4 digits vs 3 digits of time.
  if (timeString.length == 5)
  {
    var startOfTime = timeString.substring(2,3).concat(':');
    startOfTime = startOfTime.concat(timeString.substring(3));

    //add a space for astetic
    startOfTime = startOfTime.concat(' ');
  }
  
  else
  {
    var startOfTime = timeString.substring(2,4).concat(':');
    startOfTime = startOfTime.concat(timeString.substring(4));

    //add a space for astetic
    startOfTime = startOfTime.concat(' ');
  }
  return startOfTime.concat(endOfTime);
}

function populateModifyCarsModal()
{
  document.getElementById('directModifyJSONInput').value = JSON.stringify(cars, null, 2);
}

function saveDirectCarModifyChanges()
{
  var value;
  try 
  {
    value = JSON.parse(document.getElementById('directModifyJSONInput').value);
  } 
  catch(e) 
  {
    alert("JSON parse error: " + e);
    return;
  }

  // Save it and close the modal
  cars = value;
  $('#directModifyJSON').modal('hide')
  changedPage = true;
  updateHighlightingAndTables();
}

function aliasToEmail(alias)
{
   if (alias in allPreferences) 
   {
     return alias;
   } 

   else 
   {
     // They must have given a name or a "preferred email" instead of their
     // gmail
     for (var person in allPreferences) 
     {
       var theirPreferences = allPreferences[person];

       if (theirPreferences.prefEmail == alias
           || theirPreferences.name.toLowerCase() == alias.toLowerCase()) 
       {
         return person;
       }
     }
   }
 }

 function emailToCarSize(email) 
 {
   return allPreferences[email].numPassengers;
 }

function directlyAddCar(day) 
{
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

  for (var i=0; i<amPassengerInputs.length; ++i)
  {
    var p = amPassengerInputs[i].value;
    if (!p) continue;
    amPassengers.push(aliasToEmail(p));
  }

  var pmPassengers = [];

  for (var i=0; i<pmPassengerInputs.length; ++i) 
  {
    var p = pmPassengerInputs[i].value;
    if (!p) continue;
    pmPassengers.push(aliasToEmail(p));
  }

  // Change the times to the right format
  amtime = parseInt(amtime.slice(0,2), 10).toString() + amtime.slice(amtime.length-2);
  pmHour = parseInt(pmtime.slice(0,2), 10);

  if (pmHour > 12)
  {
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

function directlyAddCarClear(day)
{
  var theForm = document.getElementById('directAddForm'+day);
  theForm.reset();
}

window.addEventListener("beforeunload", function (e) 
{
  if (changedPage) 
  {
    var confirmationMessage = "You have unsaved cars!";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }
});