
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

      if (td.getAttribute('selected') == 'false') {
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

var submitting = false;

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
  submitting = true;
}

window.addEventListener("beforeunload", function (e) {
  if (submitting) return;
  var changedPage = false;

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
        changedPage = true;
        break;
      }
    }
  }

  changedPage |= !timeForm.MondayDriveStatus[1].checked ||
                 !timeForm.TuesdayDriveStatus[1].checked ||
                 !timeForm.WednesdayDriveStatus[1].checked ||
                 !timeForm.ThursdayDriveStatus[1].checked ||
                 !timeForm.FridayDriveStatus[1].checked;


  if (changedPage) {
    var confirmationMessage = "You have not submitted your times!";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }
});

