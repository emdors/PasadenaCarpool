
var mouseCurrentlyDown = false;

// If false, we're unselecting
var isCurrentlySelecting = false;

function isSelected(el) {
  return el.className == "selected";
}

window.onload = function() {
  var timeform = document.getElementById("timeForm");
  var timeinputs = timeform.getElementsByClassName("timeinput");
  for (var i=0; i<timeinputs.length; ++i) {
    var ti = timeinputs[i];
    var tds = ti.getElementsByTagName("td");
    for (var j=0; j<tds.length; ++j) {
      var td = tds[j];
      td.className = "unselected";

      td.onmouseover = function() {
        if (mouseCurrentlyDown) {
          if (isSelected(this)) {
            if (!isCurrentlySelecting) {
              this.className = "unselected";
            }
          } else {
            if (isCurrentlySelecting) {
              this.className = "selected";
            }
          }
        }
      }

      td.onmousedown = function() {
        mouseCurrentlyDown = true;
        if (!isSelected(this)) {
          this.className = "selected";
          isCurrentlySelecting = true;
        } else {
          this.className = "unselected";
          isCurrentlySelecting = false;
        }
      }

    }

    ti.onmouseup = function() {
      mouseCurrentlyDown = false;
    }

    ti.onmouseleave = function() {
      mouseCurrentlyDown = false;
    }
  }
}

function submitForm() {
  var timeform = document.getElementById("timeForm");
  var timeinputs = timeform.getElementsByClassName("timeinput");

  timeValueConcatenation = ""

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
