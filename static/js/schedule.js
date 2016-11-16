window.onload = function(editMode=false) {
  if (editMode == true) {
    console.log("hello, the edit Mode variable in onload was reached and I know it is true.");
  }
  var yourcars = document.getElementById('yourcars');
  //yourcars = none;
  var allcars = document.getElementById('allcars');
  //allcars = none;
  for (var day in cars) {

    var car = cars[day]
    for (var car_Idx in car) {

      var table = makeCarTable(allPreferences, car[car_Idx], day, true, false, user, editMode);
      allcars.appendChild(table);

      var tableisyourtable = false;
      userEmail = user;
      if (car[car_Idx]["driver"] == userEmail) {
        tableisyourtable = true;
      } else {
        for (halfday in car[car_Idx]) {
          if(halfday != "driver"){
            for (var passengerIdx=0; passengerIdx<car[car_Idx][halfday].passengers.length; ++passengerIdx) {
              if (car[car_Idx][halfday].passengers[passengerIdx] == userEmail) {
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

  // Remake the window with edit fields
  window.onload(true);
}