var weekdays = [];
var possibleDriveHours = {};
 
window.onload = function() {
  var timeResults = document.getElementById("timeResults");

  var h3s = timeResults.getElementsByTagName("h3");
  for (var h3idx=0; h3idx<h3s.length; ++h3idx) {
    weekdays.push(h3s[h3idx].textContent);
  }

  var timetables = timeResults.getElementsByClassName("timetable");
  for (var timetableidx=0; timetableidx<timetables.length; ++timetableidx) {
    var ti = timetables[timetableidx];

    var tds = ti.getElementsByTagName("td");
    for (var tdIdx=0; tdIdx<tds.length; ++tdIdx) {
      var td = tds[tdIdx];
      if (td.className == 'selected') {
        td.setAttribute('mousedover', 'false');
        td.onmouseover = function() {
          this.setAttribute('mousedover', 'true');
        }
        td.onmouseleave = function() {
          this.setAttribute('mousedover', 'false');
        }
        td.onclick = function() {
          this.setAttribute('selected', 'asDriver');
        }
      }
    }
  }
}
