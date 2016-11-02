window.onload = function() {
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
  console.log("Inside the schedule.js file running things.")
  var yourcars = document.getElementById('yourcars');
  var allcars = document.getElementById('allcars');
  for (var day in cars) {

    var car = cars[day]
    for (var car_Idx in car) {

      var table = makeCarTable(allPreferences, car[car_Idx], day, true, false, user);
      allcars.appendChild(table);

      var tableisyourtable = false;
      console.log("Car" + JSON.stringify(car[car_Idx]));
      console.log("user" + user);
      userEmail = aliasToEmail(user);
      if (car[car_Idx]["driver"] == userEmail) {
        tableisyourtable = true;
      } else {
        for (halfday in car[car_Idx]) {
          console.log("HALFDAY" + halfday)
          console.log(typeof halfday);
          if(halfday != "driver"){
            console.log("what we want the length of" + car[car_Idx][halfday].passengers);
            for (var passengerIdx=0; passengerIdx<car[car_Idx][halfday].passengers.length; ++passengerIdx) {
              console.log("HERE it is your table" + car[car_Idx][halfday].passengers[passengerIdx] );
              if (aliasToEmail(car[car_Idx][halfday].passengers[passengerIdx]) == userEmail) {
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
