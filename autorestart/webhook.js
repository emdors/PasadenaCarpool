var spawn = require('child_process').spawn;
var app = require('express')();

spawn("./update_and_restart_app").unref()

app.post('/', function() {
    console.log('Updating!');
    spawn("./update_and_restart_app").unref()
});

app.listen(25019);
