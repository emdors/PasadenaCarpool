window.onload = function(editMode=false) {
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

addCarpooler = function(obj) {
  // TODO make this function add text from input field to table
  // TODO make this function update dynamic json with added input to table
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  parent = obj.parentNode;
  var newText = document.createTextNode(obj.parentNode.firstChild.value)
  cell.appendChild(newText);
  row.appendChild(cell);
  obj.parentNode.parentNode.insertBefore(cell, null);
}