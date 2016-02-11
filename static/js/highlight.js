
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

    // If mouse is released...
    ti.onmouseup = function() {
      mouseCurrentlyDown = false;
    }

    // If mouse leaves the table, make the user click again before they can
    // select more things. Useful because we don't know if they unclicked while
    // offscreen or something. It's also natural-ish. This could be changed to
    // apply to the table as a whole so they don't have to relick as much.
    ti.onmouseleave = function() {
      mouseCurrentlyDown = false;
    }
  }
}

// When the form is submitted, figure out what class (color) each box is and
// put that into a form input so that it'll send it with the POST
function submitForm() {
  var timeform = document.getElementById("timeForm");
  var timeinputs = timeform.getElementsByClassName("timeinput");

  var timeValueConcatenation = ""

  for (var i=0; i<timeinputs.length; ++i) {
    var ti = timeinputs[i];
    var tds = ti.getElementsByTagName("td");
    for (var j=0; j<tds.length; ++j) {
      var td = tds[j];
      if (isSelected(td)) {
        timeValueConcatenation += td.id + ",";
      }
    }
  }

  var inputToPutThingsIn = document.getElementById("timeValuesToSubmit");
  inputToPutThingsIn.value = timeValueConcatenation;
}
