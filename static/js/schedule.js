window.onload = function(editMode=false) {
  //console.log(cars);
  if (editMode == true) {
    console.log("hello, the edit Mode variable in onload was reached and I know it is true.");
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
  document.getElementById("editButton").style.display = 'none';

  // Remake the window with edit fields
  window.onload(true);
}

saveSchedule = function() {
  //TODO add saving of cars here

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
  document.getElementById("editButton").style.display = 'block';

  // Remake the window with edit fields
  window.onload(false);
}

addCarpoolerLeft = function(obj) {
  // TODO make this function add text from input field to table
  // TODO make this function update dynamic json with added input to table
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  parent = obj.parentNode;
  var rider = obj.parentNode.firstChild.value;
  var newText = document.createTextNode(rider);
  obj.parentNode.firstChild.value = '';
  cell.appendChild(newText);
  row.appendChild(cell);
  row.appendChild(document.createElement('td'));
  obj.parentNode.parentNode.parentNode.insertBefore(row, null);
  var day = obj.parentNode.parentNode.parentNode.firstChild.firstChild.innerHTML;
  var driver = obj.parentNode.parentNode.parentNode.childNodes[1].firstChild.firstChild.innerHTML;
  console.log(day);
  console.log(driver);
  var possible_cars = cars[day];
  for (car_Idx in possible_cars){
    var car = possible_cars[car_Idx];
    console.log(car);
    if (car.driver == aliasToEmail(driver)){
      console.log(car.AM.passengers);
      car.AM.passengers.push(rider);
      console.log(car.AM.passengers);
      console.log(cars[day][car_Idx].AM.passengers);
      cars[day][car_Idx].AM.passengers = car.AM.passengers;
      console.log(cars[day][car_Idx].AM.passengers);
    }
  }
  //fs.writeFile(,  JSON.stringify(cars));

}

addCarpoolerRight = function(obj) {
  // TODO make this function add text from input field to table
  // TODO make this function update dynamic json with added input to table
  var row = document.createElement('tr');
  row.appendChild(document.createElement('td'));
  var cell = document.createElement('td');
  parent = obj.parentNode;
  var newText = document.createTextNode(obj.parentNode.firstChild.value);
  (obj.parentNode.firstChild.value)
  obj.parentNode.firstChild.value = '';
  cell.appendChild(newText);
  row.appendChild(cell);
  
  obj.parentNode.parentNode.parentNode.insertBefore(row, null);
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
