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


//This function is called by the finish car button and 
//adds a new car to the car list.
function makeCar(day){
  var timeResults = document.getElementById("timeResults");

  //determine the numerical value of this day of the week so we know 
  //which tables we should look at
  var dayNumber = 0

  for(var i = 0; i < weekdays.length; ++i){
    if (weekdays[i] == day){
      dayNumber = i
    }
  }

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
        if(td.getAttribute('carstatus') == 'driver'){
          driver = tr.getElementsByClassName('name')[0].innerHTML
          console.log(tr)
          time = td.getAttribute('id')

          td.setAttribute('carstatus', '')

          tr.setAttribute('inCar', 'true')

        //if it is a passenger then add its name to the passenger list and
        //reset its car status as well as set there inCar attribute to true
        }else if (td.getAttribute('carstatus') == 'passenger'){
          passengers.push(tr.getElementsByClassName('name')[0].innerHTML)
          td.setAttribute('carstatus', '')
          tr.setAttribute('inCar', 'true')
        }
      }
    }
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
  }

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
    console.log(carTables[i].getAttribute('selected'))
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
    //determine which table it should be in by looking at the time
    //TODO implement
    var timeTable = timeResults.getElementsByClassName("timetable")[2*dayNumber]

    //Get all of the names from this car.
    namesFromCar = carsToDelete[i].getElementsByTagName('td')

    //Check the names from this car verse the time table
    for(var nameIdx = 3; nameIdx < namesFromCar.length; nameIdx += 2){
      var name = namesFromCar[nameIdx].innerHTML

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
  console.log(time)
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

