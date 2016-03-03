
var selected = "selected";
var unselected = "unselected";

function isSelected(el) {
  return el.getAttribute('selected') == 'true';
}

// Global variables keep track of if user is mousing over stuff and if they are
// selecting or unselecting
var mouseCurrentlyDown = false;
// If false, we're unselecting
var isCurrentlySelecting = false;

window.onload = function() {

  // For each box in each form...
  var timeform = document.getElementById("timeForm");
  var timeinputs = timeform.getElementsByClassName("timeinput");
  for (var i=0; i<timeinputs.length; ++i) {
    var ti = timeinputs[i];
    var tds = ti.getElementsByTagName("td");
    for (var j=0; j<tds.length; ++j) {
      var td = tds[j];

      // When moused over, if we are currently selecting or unselecting, set
      // this box to the appropriate class
      td.onmouseover = function() {
        if (mouseCurrentlyDown) {
          if (isSelected(this)) {
            if (!isCurrentlySelecting) {
              this.setAttribute('selected','false');
            }
          } else {
            if (isCurrentlySelecting) {
              this.setAttribute('selected','true');
            }
          }
        }
      }

      // When mouse is clicked while on a box, swap its state and remember that
      // the mouse is down and whether we are selecting or unselecting
      td.onmousedown = function() {
        mouseCurrentlyDown = true;
        if (!isSelected(this)) {
          this.setAttribute('selected','true');
          isCurrentlySelecting = true;
        } else {
          this.setAttribute('selected','false');
          isCurrentlySelecting = false;
        }
      }

    }

  }
  // If mouse is released...
  timeform.onmouseup = function() {
    mouseCurrentlyDown = false;
  }

  // If mouse leaves the table, make the user click again before they can
  // select more things. Useful because we don't know if they unclicked while
  // offscreen or something.
  timeform.onmouseleave = function() {
    mouseCurrentlyDown = false;
  }
}

// When the form is submitted, figure out what class (color) each box is and
// put that into a form input so that it'll send it with the POST
function submitForm() {

  var timeform = document.getElementById("timeForm");
  var timeinputs = timeform.getElementsByClassName("timeinput");

  for (var i=0; i<timeinputs.length; ++i) {
    var ti = timeinputs[i];
    var dayAndHalfDay = ti.id.slice('timeinput'.length);

    var timesForThisPeriod = '';

    var tds = ti.getElementsByTagName("td");
    for (var j=0; j<tds.length; ++j) {
      var td = tds[j];
      if (isSelected(td)) {
        timesForThisPeriod += td.id.slice(dayAndHalfDay.length) + ',';
      }
    }

    var inputToPutTimesIn = document.getElementById(dayAndHalfDay + 'Times');
    inputToPutTimesIn.value = timesForThisPeriod;
  }
}

function validateForm() {
  //Grab all of the variables from the fourm
  var timeForm = document.getElementById("timeForm");
  var name = timeForm.name.value;
  var email = timeForm.email.value;
  var numPassengers = timeForm.numPassengers.value;

  // This is a list of days of the week for looping puposes
  var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  //Look at the email adress and insure that it is not blank and make
  //sure it is of the right format
  var emailError = false;

  
  

  if (email == ""){
    console.log("No email entered");
    emailError = true;
    timeForm.email.style.borderColor = "red";

  }else if(email.indexOf('@') == -1){
    console.log("impropper email adress");
    emailError = true;
    timeForm.email.style.borderColor = "red";
  }

  //Make sure the name is not blank
  var nameError = false;
  if (name == ""){
    console.log("must fill in name");
    nameError = true;
    timeForm.name.style.borderColor = "red";

  }

  //If the person puts zero as the number of people in their car
  //make sure that the have checked Cannot drive for all of their
  //values
  var drivingError = false;
  if (numPassengers == 0){
    drivingError = timeForm.MondayDriveStatus[2].checked && 
                    timeForm.TuesdayDriveStatus[2].checked &&
                    timeForm.WednesdayDriveStatus[2].checked &&
                    timeForm.ThursdayDriveStatus[2].checked &&
                    timeForm.FridayDriveStatus[2].checked;
    
    drivingError = !drivingError
    
  }

  //Color all of the boxes correctly 
  if (drivingError){
    timeForm.numPassengers.style.borderColor = "red";
  }else{
    timeForm.numPassengers.style.borderColor = "green";
  }

  if (nameError){
    timeForm.name.style.borderColor = "red";
  }else{
    timeForm.name.style.borderColor = "green";
  }

  if (emailError){
    timeForm.email.style.borderColor = "red";
  }else{
    timeForm.email.style.borderColor = "green";
  }

  //Now we put all of the errors together into a resulting error.
  var resultingError = nameError || emailError || drivingError;

  //If there is a resulting error give the user a pop up box telling them what is wrong
  if (resultingError){
    var alertString = "There were a couple of errors in your forum: \n \n ";

    if (nameError){
      alertString = alertString.concat("You forgot to fill in your name. \n \n");
    }

    if (emailError){
      alertString = alertString.concat("Either you forgot to fill in your email or it is incorrectly formated. \n \n ")
    }

    if (drivingError){
      alertString = alertString.concat("In the number of passengers section you said you did not have a car but in one of the times you listed that you can drive that day. please either click the \"Cannot drive\" box or fill in the size of your car.");
    }

    window.alert(alertString);
  }


  return !resultingError;
}