window.onload = function() {
  console.log(cars);
  var yourcars = document.getElementById('yourcars');
  var allcars = document.getElementById('allcars');

  for (var day in cars) {
    for (var driver in cars[day]) {
      var table = makeCarTable(allPreferences, cars, day, driver, true, false, user);
      allcars.appendChild(table);

      var tableisyourtable = false;
      if (driver == user) {
        tableisyourtable = true;
      } else {
        for (halfday in cars[day][driver]) {
          for (var passengerIdx=0; passengerIdx<cars[day][driver][halfday].passengers.length; ++passengerIdx) {
            if (cars[day][driver][halfday].passengers[passengerIdx] == user) {
              tableisyourtable = true;
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
