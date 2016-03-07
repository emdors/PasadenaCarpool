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

//This function is called 
function makeCar(data){
  var timeResults = document.getElementById("timeResults");

  console.log(data);
  console.log(timeResults);
  
  //Make table to hold the names of the new cars
  var carTable = document.createElement('TABLE');
  carTable.className = 'carTable'

  for (var i = 0; i < 5; i++) {
    var row = carTable.insertRow(i);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell1.innerHTML = "Pasenger"
    cell2.innerHTML = "Bob"

  };

  //Set behavior so that when this table is clicked we can 
  //denote that it has been selected.
  carTable.onclick = function(){
      if(this.getAttribute('selected') == 'true'){
        this.setAttribute('selected', 'false')
      }else{
        this.setAttribute('selected', 'true')
      }
    }

  document.getElementById(data+'Cars').appendChild(carTable);
}


//This function goes through all of the cars for that day and deletes any one which
//is selected.
function deleteCar(data){
  //Array to hold cars that need to be deleted
  var carsToDelete = []

  //Get the all the cars for that day and look for ones that are
  //selected
  var carsElement = document.getElementById(data+'Cars');
  var carTables = carsElement.getElementsByClassName('carTable');

  for (var i = 0; i < carTables.length; ++i){
    console.log(carTables[i].getAttribute('selected'))
    if (carTables[i].getAttribute('selected') == 'true'){
      carsToDelete.push(carTables[i])
    }
  }

  //Now we go through and remove all of these tables
  for (var i = 0; i < carsToDelete.length; ++i){
    carsElement.removeChild(carsToDelete[i])
  }
  
}

