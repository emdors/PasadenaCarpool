var weekdays = [];
var possibleDriveHours = {};
 
window.onload = function() {
  var timeResults = document.getElementById("timeResults");

  var h3s = timeResults.getElementsByTagName("h3");
  for (var h3idx=0; h3idx<h3s.length; h3idx +=2) {
    weekdays.push(h3s[h3idx].textContent);
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
          //Make sure that we can only change the car status of selected tiles.
          if(this.getAttribute('selected') == 'true'){
            if (this.getAttribute('carstatus') == 'passenger'){
              this.setAttribute('carstatus', 'driver');
            } else if (this.getAttribute('carstatus') == 'driver'){
              this.setAttribute('carstatus', '');
            } else{
              this.setAttribute('carstatus', 'passenger');
            }
          }
        }
      }
    }
  }
}


//This function is called by the finish car button and 
//adds a new car to the car list.
function makeCar(day){
  var timeResults = document.getElementById("timeResults");
  console.log(timeResults)
  //determine the numerical value of this day of the week so we know 
  //which tables we should look at
  var dayNumber = 0

  for(var i = 0; i < weekdays.length; ++i){
    if (weekdays[i] == day){
      dayNumber = i
    }
  }


  //Check to see the overide box is check
  var overide = document.getElementsByClassName('override')[dayNumber].checked;
  //reset status
  document.getElementsByClassName('override')[dayNumber].checked = false;
  
  //Get a list of the time tables and select the am and pm tables we are
  //interested in.
  var timeTables = timeResults.getElementsByClassName("timetable");
  var amTable = timeTables[2*dayNumber]
  var pmTable = timeTables[2*dayNumber + 1]

  var tablesForDay = [amTable, pmTable]

  //Create a temporay varable to hold the time, the drivers name and the passengers name
  var driver = ''
  var passengers = []
  var time = ''

  //Variable to do with error checking
  var trOfCar = []
  var carError = false
  var errorString = 'While you were trying to make a car there were the following errors: \n'

  //Do the following search and creation for both the
  //am and pm tables
  for(var i = 0; i < tablesForDay.length; ++i){
    var currTable = tablesForDay[i]
    //go through the am table and split it apart into each forum submision
    var trs = currTable.getElementsByClassName('timeview');
    for (var trIdx=0; trIdx<trs.length; ++trIdx) {
      var tr = trs[trIdx];
      //Get the entries for this submision
      var tds = tr.getElementsByTagName('td');


      //We can start at 1 because the first entry is a name
      for (var tdIdx = 1; tdIdx < tds.length; ++tdIdx){
        var td = tds[tdIdx]

        //if it is a driver save the name and time and reset the car status
        //as well as set there inCar attribute to true
        if((td.getAttribute('carstatus') == 'driver') || (td.getAttribute('carstatus') == 'passenger')){
          //if there is no time currently then change it, otherwise make
          //sure the times are the same
          if (time == ''){
            time = td.getAttribute('id')
          }else{
            if (!(time == td.getAttribute('id')) ){
              carError = true
              errorString = errorString.concat('You entered multiple times for one car. \n')
            }
          }

          //if there is restrictions on driving keep this info
          var restrictions = ''

          if (tr.getElementsByClassName('driveStatus').length == 1)
            restrictions = tr.getElementsByClassName('driveStatus')[0].innerHTML
          


          //Set the driver name or add the passenger
          if(td.getAttribute('carstatus') == 'driver'){
            //If there is already a driver set then throw an error
            if (!(driver == '') ){
              errorString = errorString.concat('You picked two drivers. \n')
              carError = true
            }

            driver = tr.getElementsByClassName('name')[0].innerHTML

            //Make sure that this person did not say that they could not drive
            if(restrictions == 'cannot drive'){
              carError = true
              errorString = errorString.concat('You made someone a driver who cannot drive that day. \n')
            }

            if(tr.getAttribute('isPassenger' == 'true')){
              carError = true
              errorString = errorString.concat('You made someone a driver who is already a passenger going the otherway. \n')

            }

          }else{
            passengers.push(tr.getElementsByClassName('name')[0].innerHTML)

            //If the person said they must drive they cannot be a passenger
            if(restrictions == 'must drive'){
              carError = true
              errorString = errorString.concat('You made someone a passenger who must drive that day. \n')
            }

            //If the person is a driver in another car then they cannot be a passenger in this car
            if(tr.getAttribute('isDriver') == 'true'){
              carError = true
              errorString = errorString.concat('You made someone a passenger who is already a driver going the otherway. \n')
            }
          }


          //check if the person is alread in a car.
          if(tr.getAttribute('inCar') == 'true'){
            errorString = errorString.concat('You tried to but someone who is already in a car. \n')
            carError = true
            td.setAttribute('carstatus', '')
          }else{
            td.setAttribute('carstatus', '')
            tr.setAttribute('inCar', 'true')
            trOfCar.push(tr)
          }
        }
      }
    }
  }
  
  //Check if the drive string is still empty. In this case let the user know that they
  //forgot to add a driver.
  if(driver == ''){
    carError = true
    errorString = errorString.concat('you did not select a driver. \n')
  }
  //Check if there is a car error, in which case notify the user change the 
  //in car status of all the passengers and exit the function
  if(carError && !overide){
    window.alert(errorString)

    for(var i = 0; i < trOfCar.length; ++i){
      trOfCar[i].setAttribute('inCar', 'false')
    }

    return

  }


  //Make table to hold the names of the new cars
  var carTable = document.createElement('TABLE');
  carTable.className = 'carTable'

  //Create a more readable time string
  var timeString = parseTime(time)
  //Add the time the car is leaving and the driver
  addToCar(carTable, 'Time Leaving', timeString,0);

  addToCar(carTable, 'Driver', driver,1);

  for(var i = 0; i < passengers.length; ++i){
    addToCar(carTable, 'Passenger', passengers[i], 2 + i);
    setIsAt(passengers[i], 'true', dayNumber, 'isPassenger')
  }
  //Set the person as a driver in the AM and PM tables
  setIsAt(driver, "true", dayNumber, 'isDriver')

  //Set behavior so that when this table is clicked we can 
  //denote that it has been selected.
  carTable.onclick = function(){
      if(this.getAttribute('selected') == 'true'){
        this.setAttribute('selected', 'false')
      }else{
        this.setAttribute('selected', 'true')
      }
    }


  document.getElementById(day+'Cars').appendChild(carTable);
}


//This function goes through all of the cars for that day and deletes any one which
//is selected.
function deleteCar(day){
  //Array to hold cars that need to be deleted
  var carsToDelete = []

  //Get the all the cars for that day and look for ones that are
  //selected
  var carsElement = document.getElementById(day+'Cars');
  var carTables = carsElement.getElementsByClassName('carTable');

  for (var i = 0; i < carTables.length; ++i){
    if (carTables[i].getAttribute('selected') == 'true'){
      carsToDelete.push(carTables[i])
    }
  }

  //Get the tables for this day
  var dayNumber = 0

  for(var i = 0; i < weekdays.length; ++i){
    if (weekdays[i] == day){
      dayNumber = i
    }
  }
  
  //look at each car we are going to delete
  for(var i = 0; i < carsToDelete.length; ++i){
    namesFromCar = carsToDelete[i].getElementsByTagName('td')

    var timeTable = ''
    var otherTimeTable = ''
    //determine which table it should be in by looking at the time
    var timeString = namesFromCar[1].innerHTML
 
    if(timeString.substring(timeString.length-2) == 'AM'){
      timeTable = timeResults.getElementsByClassName("timetable")[2*dayNumber]
      otherTimeTable = timeResults.getElementsByClassName("timetable")[2*dayNumber + 1]
    }else{
      timeTable = timeResults.getElementsByClassName("timetable")[2*dayNumber + 1]
      otherTimeTable = timeResults.getElementsByClassName("timetable")[2*dayNumber]
    }    

    //Check the names from this car verse the time table
    for(var nameIdx = 3; nameIdx < namesFromCar.length; nameIdx += 2){
      var name = namesFromCar[nameIdx].innerHTML

      //First we want to see if this person is in a car in the other table
      var inOtherCar = checkInCar(name, otherTimeTable)
      console.log(inOtherCar)
      //If they are not in a car during another time recent their status
      if (!inOtherCar){
        if(nameIdx == 3){
          setIsAt(name, 'false', dayNumber, 'isDriver')
        }else{
          setIsAt(name, 'false', dayNumber, 'isPassenger')
        }
      }

      //Now go through all of the submissions and check to see if the 
      //names are the same and set their inCar status equal to false.
      var trs = timeTable.getElementsByClassName('timeview')

      for(var trIdx = 0; trIdx < trs.length; ++trIdx){
        //If the name of the submission is the same as the one on the table 
        //set in car to false.
        if (name == trs[trIdx].getElementsByClassName('name')[0].innerHTML){
          trs[trIdx].setAttribute('inCar', 'false')
        }
      }
    }
  }

  //Remove the car from the cars list.
  for (var i = 0; i < carsToDelete.length; ++i){
    carsElement.removeChild(carsToDelete[i])
  }

}

function checkForCompletion(){
  //extract the time tables from the website
  var timeResults = document.getElementById("timeResults");
  var timeTables = timeResults.getElementsByClassName("timetable")

  //Set the complete variable equal to true
  var complete = true


  //Now for each table on the site, make sure that every peroson is in a car.
  for (var tableIdx = 0; tableIdx < timeTables.length; ++tableIdx){
    table = timeTables[tableIdx];

    //get a list of each person entry for the table.
    var trs = table.getElementsByClassName('timeview');

    //check to see if each person is in a car
    for (var trIdx = 0; trIdx < trs.length; ++trIdx){
      tr = trs[trIdx]
      // if the person is not in a car check if they listed that they wanted to drive at some time:
      if(!(tr.getAttribute('inCar') == 'true')){
        //get the list of cells
        tds = tr.getElementsByTagName('td');

        //go through all the cells and if we see one time that isSelected we know that this person
        //should be in a car but is not so we know that this page is not complete so set
        //complete equal to false
        for(var tdIdx = 1; tdIdx < tds.length; ++tdIdx){
          td = tds[tdIdx];
          if (td.getAttribute('selected') == 'true'){
            complete = false
          }
        }
      }
    }



  }

  //If the forum is not complete alert the user.
  if(!complete){
    window.alert("form is incomplete, not everyone is in a car.")
  }else{
    window.alert("form is complete")
  }

  return complete

}

//This is a helper function which makes it easiar to add things to cars
function addToCar(carTable, name, value, rowNum){
  var row = carTable.insertRow(rowNum);
  cell1 = row.insertCell(0);
  cell2 = row.insertCell(1);
  cell1.innerHTML = name;
  cell2.innerHTML = value;
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

//This function is a helper function which sets wheter a person is a driver or not 
function setIsAt(name, status, dayNumber, attribute){
  var timeResults = document.getElementById("timeResults");

  var timeTables = timeResults.getElementsByClassName("timetable");
  var amTable = timeTables[2*dayNumber]
  var pmTable = timeTables[2*dayNumber + 1]
  var tablesForDay = [amTable, pmTable]

  for(var i = 0; i < tablesForDay.length; ++i){
    table = tablesForDay[i]
    var trs = table.getElementsByClassName("timeview");

    for(var trNum = 0; trNum < trs.length; ++trNum){
      //if we have found the name set the status
      tr = trs[trNum]
      if (name == tr.getElementsByClassName('name')[0].innerHTML){
        tr.setAttribute(attribute, status)
      }
    }
  } 
}

//This function goes through the time table and checks if a person is in a car in a given time table
function checkInCar(name, timeTable){
  var trs = timeTable.getElementsByClassName('timeview')

  for(var trIdx = 0; trIdx < trs.length; ++trIdx){
    //If the name of the submission is the same as the one on the table 
    //set in car to false.
    if (name == trs[trIdx].getElementsByClassName('name')[0].innerHTML){
      return trs[trIdx].getAttribute('inCar') == 'true'
    }
    //if there name is not in this table return false
    
  }
  return false

}

