function makeCarTable(allPreferences, cars, car_Idx, day, showDays, editMode, userToHighlight) {
  // driver = cars[day][car_Idx].driver
  // Create a new table
  var carsTemp = cars;
  var car = carsTemp[day][car_Idx] 
  var carTable = document.createElement('table');
  var carTableBody = document.createElement('tbody');
  carTable.className = 'table fullcartable table-bordered';
  console.log("car" + JSON.stringify(cars));
  // If we want to show the day, do it
  if (showDays) {
    var dayRow = document.createElement('tr');
    var dayCell = document.createElement('td');
    dayCell.appendChild(document.createTextNode(day));
    dayCell.setAttribute('colspan', 2);
    dayRow.appendChild(dayCell);
    dayRow.className = 'day';
    carTableBody.appendChild(dayRow);
  }

  // Put the driver's name in
  var driverRow = document.createElement('tr');
  var driverCell = document.createElement('td');
  // The name itself goes in a <span>, and the text " (driver)" goes after it.
  // This is so we can find the driver's name easily
  var driver = car["driver"];
  var driverNameSpan = document.createElement('span');
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

  var driverEmail = aliasToEmail(driver);
  driverNameSpan.appendChild(document.createTextNode(allPreferences[driverEmail].name));
  driverNameSpan.className = 'drivername';
  if (userToHighlight == driverEmail) {
    var strong = document.createElement('strong');
    strong.appendChild(driverNameSpan);
    driverCell.appendChild(strong);
  } else {
    driverCell.appendChild(driverNameSpan);
  }
  driverCell.appendChild(document.createTextNode(' (driver)'));
  driverCell.setAttribute('colspan', 2);

  if (editMode == true) {
    // Make a delete button for the car
    var deletePartOfCarBtn = document.createElement('button');
    deletePartOfCarBtn.className = 'close';
    var deletePartOfCarBtnIcon = document.createElement('span');
    deletePartOfCarBtnIcon.className = "glyphicon glyphicon-remove";
    deletePartOfCarBtnIcon.setAttribute('aria-hidden',"true");
    deletePartOfCarBtn.appendChild(deletePartOfCarBtnIcon);
    // This is weird... basically, we want to make a copy of these parameters
    // so that the closure has its own copy. Making a function lets us do that.
    function setdeletePartOfCarBtnOnClick(day, driver) {
      deletePartOfCarBtn.onclick = function() {deleteWholeCar(day, driver);};
    }
    setdeletePartOfCarBtnOnClick(day, driver);
    deletePartOfCarBtn.setAttribute('type', 'button');
    driverCell.appendChild(deletePartOfCarBtn);
  }

  driverRow.appendChild(driverCell);
  driverRow.className = 'driver';
  carTableBody.appendChild(driverRow);

  // Put the time in
  var timeRow = document.createElement('tr');
  timeRow.className = 'timerow';
  for (var halfdayIdx=0; halfdayIdx<2; ++halfdayIdx) {
    var halfday = ['AM', 'PM'][halfdayIdx];
    var timeCell = document.createElement('td');
    if (car[halfday]) {
      var timeString = parseTime(day+halfday+car[halfday].time);
      timeCell.appendChild(document.createTextNode(timeString));
    }
    timeRow.appendChild(timeCell);
  }
  carTableBody.appendChild(timeRow);

  // Put passengers in
  for (var passengerIdx=0;
           (car.AM && passengerIdx < car.AM.passengers.length)
        || (car.PM && passengerIdx < car.PM.passengers.length);
        ++passengerIdx) {
    // Keep putting a pair of passengers in the table until there's no more
    // in both AM and PM
    var row = document.createElement('tr');
    row.className = 'passengerrow';
    for (var halfdayIdx=0; halfdayIdx<2; ++halfdayIdx) {
      var halfday = ['AM', 'PM'][halfdayIdx];
      var cell = document.createElement('td');
      if (car[halfday] && car[halfday].passengers.length > passengerIdx) {
        var passenger = car[halfday].passengers[passengerIdx];
        if (userToHighlight == passenger) {
          var strong = document.createElement('strong');
          strong.appendChild(document.createTextNode(allPreferences[passenger].name));
          cell.appendChild(strong);
        } else {
          cell.appendChild(document.createTextNode(allPreferences[passenger].name));
        }

        if(editMode == true) {
           // Make a delete button for the car
            var deletePartOfCarBtn = document.createElement('button');
            deletePartOfCarBtn.className = 'close';
            var deletePartOfCarBtnIcon = document.createElement('span');
            deletePartOfCarBtnIcon.className = "glyphicon glyphicon-remove";
            deletePartOfCarBtnIcon.setAttribute('aria-hidden',"true");
            deletePartOfCarBtn.appendChild(deletePartOfCarBtnIcon);
            // This is weird... basically, we want to make a copy of these parameters
            // so that the closure has its own copy. Making a function lets us do that.
            function setdeletePartOfCarBtnOnClick(day, driver) {
              console.log("here the button has been clicked");
              deletePartOfCarBtn.onclick = function() {deleteWholeCar(day, driver);};
            }
            setdeletePartOfCarBtnOnClick(day, driver);
            deletePartOfCarBtn.setAttribute('type', 'button');
            cell.appendChild(deletePartOfCarBtn);
        }
      }
      row.appendChild(cell);
    }
    carTableBody.appendChild(row);
  }

  if (editMode == true) {
     var row = document.createElement('tr');
     var cell = document.createElement('td');
     var writeInField = document.createElement('input');
     cell.appendChild(writeInField);
     var cell2 = document.createElement('td');
     var writeInField2 = document.createElement('input');
     cell2.appendChild(writeInField2);
     row.appendChild(cell);
     row.appendChild(cell2);
     carTableBody.appendChild(row);
   }

  carTable.appendChild(carTableBody);

  return carTable;
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
  if (timeString.length == 5){
    var startOfTime = timeString.substring(2,3)
    startOfTime = startOfTime.concat(timeString.substring(3))

    //add a space for astetic
    startOfTime = startOfTime.concat(' ')
  }else{
    var startOfTime = timeString.substring(2,4)
    if(startOfTime > 12) {
      startOfTime -= 12
      startOfTime = startOfTime.toString()
    }
    startOfTime = startOfTime.concat(timeString.substring(4))
    //add a space for astetic
    startOfTime = startOfTime.concat(' ')
  }
  return startOfTime.concat(endOfTime)
}
