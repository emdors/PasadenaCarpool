window.onload = function(editMode=false) {
  //console.log(cars);
  if (editMode == true) {
    console.log("hello, the edit Mode variable in onload was reached and I know it is true.");
    var carsText = document.createTextNode(JSON.stringify(cars));
    var carsNode = document.createElement('div');
    carsNode.appendChild(carsText);
    carsNode.setAttribute('id', 'cars');
  }
  var yourcars = document.getElementById('yourcars');
  //yourcars = none;
  var allcars = document.getElementById('allcars');
  //allcars = none;
  for (var day in cars) {
    for (var car_Idx in cars[day]) {
      
      var car = cars[day][car_Idx]
      var table = makeCarTable(allPreferences, car_Idx, day, true, editMode, user);
      console.log(JSON.stringify(car));
      allcars.appendChild(table);

      var tableisyourtable = false;
      userEmail = user;
      if (car["driver"] == userEmail) {
        tableisyourtable = true;
      } else {
        for (halfday in car) {
          if(halfday != "driver"){
            for (var passengerIdx=0; passengerIdx<car[halfday].passengers.length; ++passengerIdx) {
              if (car[halfday].passengers[passengerIdx] == userEmail) {
                tableisyourtable = true;
              }
            }
          }
        }
      }
      if (tableisyourtable) {
        yourcars.appendChild(table.cloneNode(true));
      }
    }
  }
}

makeEditBoxesVisible = function() {
  // Clear the current cars
  document.getElementById('yourcars').innerHTML = '';
  document.getElementById('allcars').innerHTML = '';

  // Regenterate the headings
  var yourHeading = document.createElement('h1');
  var headingContent = document.createTextNode("Your Cars");
  yourHeading.appendChild(headingContent);
  var allHeading = document.createElement('h1');
  var allheadingContent = document.createTextNode("All Cars");
  allHeading.appendChild(allheadingContent);
  
  document.getElementById('yourcars').appendChild(yourHeading);
  document.getElementById('allcars').appendChild(allHeading);

  // Make save schedule visible
  //var saveEdits = document.getElementById("saveEdits");
  document.getElementById("saveEditsButton").style.display = 'block';
  document.getElementById("cancelButton").style.display = 'block';
  document.getElementById("editButton").style.display = 'none';

  // Remake the window with edit fields
  window.onload(true);
}
function deleteWholeCar(day, driver) {
  console.log("deleteWhole is being called");
  console.log("before" + JSON.stringify(carsTemp));
  console.log("the driver?" + JSON.stringify(delete carsTemp[day][0]["AM"].passengers[0]));
  delete carsTemp[day][0]["AM"].passengers[0]
  delete carsTemp[day][0]["PM"].passengers[0]
  carsTemp[day][0]["AM"].passengers[0] = "Deleted Driver"
  carsTemp[day][0]["PM"].passengers[0] = "Deleted Driver"
  console.log("after" + JSON.stringify(carsTemp))
  // cars = delete cars[day].driver;
  // console.log("after2" + JSON.stringify(cars))
  changedPage = true;
  // updateHighlightingAndTables(day);
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
  // updateHighlightingAndTables(day);
}
saveSchedule = function() {
  //TODO add saving of cars here
  console.log('In save schedule');
  // var carsNode = document.createTextNode(JSON.stringify(cars));
  // carsNode.setAttribute('id', 'cars');
  console.log(JSON.stringify(cars));
  console.log("carsTemp" + JSON.stringify(carsTemp));
  cars = carsTemp;

  // Clear the current cars displayed
  document.getElementById('yourcars').innerHTML = '';
  document.getElementById('allcars').innerHTML = '';

  // Regenterate the headings
  var yourHeading = document.createElement('h1');
  var headingContent = document.createTextNode("Your Cars");
  yourHeading.appendChild(headingContent);
  var allHeading = document.createElement('h1');
  var allheadingContent = document.createTextNode("All Cars");
  allHeading.appendChild(allheadingContent);
  
  document.getElementById('yourcars').appendChild(yourHeading);
  document.getElementById('allcars').appendChild(allHeading);

  // Make save schedule visible
  //var saveEdits = document.getElementById("saveEdits");
  document.getElementById("saveEditsButton").style.display = 'none';
  document.getElementById("cancelButton").style.display = 'none';
  document.getElementById("editButton").style.display = 'block';

  // Remake the window with edit fields
  window.onload(false);
}
dontSaveSchedule = function() {
  console.log('In dont save schedule');
  console.log(JSON.stringify(cars));
  console.log("carsTemp" + JSON.stringify(carsTemp));

  // Clear the current cars displayed
  document.getElementById('yourcars').innerHTML = '';
  document.getElementById('allcars').innerHTML = '';

  // Regenterate the headings
  var yourHeading = document.createElement('h1');
  var headingContent = document.createTextNode("Your Cars");
  yourHeading.appendChild(headingContent);
  var allHeading = document.createElement('h1');
  var allheadingContent = document.createTextNode("All Cars");
  allHeading.appendChild(allheadingContent);
  
  document.getElementById('yourcars').appendChild(yourHeading);
  document.getElementById('allcars').appendChild(allHeading);

  // Make save schedule visible
  //var saveEdits = document.getElementById("saveEdits");
  document.getElementById("saveEditsButton").style.display = 'none';
  document.getElementById("cancelButton").style.display = 'none';
  document.getElementById("editButton").style.display = 'block';

  // Remake the window with edit fields
  window.onload(false);
}

addCarpoolerLeft = function(obj) {
  // TODO make this function add text from input field to table
  // TODO make this function update dynamic json with added input to table
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var rider = obj.parentNode.firstChild.value;
  var newText = document.createTextNode(rider);
  obj.parentNode.firstChild.value = '';
  cell.appendChild(newText);
  row.appendChild(cell);
  row.appendChild(document.createElement('td'));
  obj.parentNode.parentNode.parentNode.insertBefore(row, null);
  var day = obj.parentNode.parentNode.parentNode.firstChild.firstChild.innerHTML;
  var driver = obj.parentNode.parentNode.parentNode.childNodes[1].firstChild.firstChild.innerHTML;
  var possible_cars = cars[day];
  for (car_Idx in possible_cars){
    var car = possible_cars[car_Idx];
    if (car.driver == aliasToEmail(driver)){
      car.AM.passengers.push(rider);
      cars[day][car_Idx].AM.passengers = car.AM.passengers;
    }
  }
  //fs.writeFile(,  JSON.stringify(cars));

}

addCarpoolerRight = function(obj) {
  // TODO make this function add text from input field to table
  // TODO make this function update dynamic json with added input to table
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var rider = obj.parentNode.firstChild.value;
  var newText = document.createTextNode(rider);
  obj.parentNode.firstChild.value = '';
  cell.appendChild(newText);
  row.appendChild(document.createElement('td'));
  row.appendChild(cell);
  
  obj.parentNode.parentNode.parentNode.insertBefore(row, null);
  var day = obj.parentNode.parentNode.parentNode.firstChild.firstChild.innerHTML;
  var driver = obj.parentNode.parentNode.parentNode.childNodes[1].firstChild.firstChild.innerHTML;
  var possible_cars = cars[day];
  for (car_Idx in possible_cars){
    var car = possible_cars[car_Idx];
    console.log(car);
    if (car.driver == aliasToEmail(driver)){
      car.PM.passengers.push(rider);
      cars[day][car_Idx].PM.passengers = car.PM.passengers;
    }
  }
}

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
