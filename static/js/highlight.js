
var selected = "selected";
var unselected = "unselected";

function isSelected(el) {
  return el.className == selected;
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

      // Start each box as unselected
      td.className = unselected;

      // When moused over, if we are currently selecting or unselecting, set
      // this box to the appropriate class
      td.onmouseover = function() {
        if (mouseCurrentlyDown) {
          if (isSelected(this)) {
            if (!isCurrentlySelecting) {
              this.className = unselected;
            }
          } else {
            if (isCurrentlySelecting) {
              this.className = selected;
            }
          }
        }
      }

      // When mouse is clicked while on a box, swap its state and remember that
      // the mouse is down and whether we are selecting or unselecting
      td.onmousedown = function() {
        mouseCurrentlyDown = true;
        if (!isSelected(this)) {
          this.className = selected;
          isCurrentlySelecting = true;
        } else {
          this.className = unselected;
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
  if (email == ""){
    console.log("No email entered");
  }else if(email.indexOf('@') == -1){
    console.log("in propper email adress");
  }

  //Make sure the name is not blank
  if (name == ""){
    console.log("must fill in name");
  }

  //If the person puts zero as the number of people in their car
  //make sure that the have checked Cannot drive for all of their
  //values
  if (numPassengers == 0){
    for (var i = 0; i < weekdays.length; i++){
      var statusName = weekdays[i].concat("DriveStatus[2].checked");
      var status = window["timeForm.".concat(statusName)]//.statusName.value;
      console.log(status)
    }
  }
  console.log(document.getElementById("timeForm"));


  return false;
}