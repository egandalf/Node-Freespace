var express = require('express');
var promise = require('promise');
var exec = require('child_process').exec;
var child;
var port = 3000;

var app = express();

app.get('/free', function(req, res){
    fsFreeSpace()
        .then(
            function(output) {
                res.append("Content-Type", "text/plain");
                res.send(output);
            });
});

app.listen(port, function(){
    console.log("Server listening on port %s.", port);
});

var fsFreeSpace = function(){
    return new promise(function(fulfill, reject){
        var command = "diskutil info disk1";
        child = exec(command, function(error, stdout, stderr){
            console.log("StdErr: " + stderr);
            console.log("Error: " + error);
            readOutput(stdout).then(function(result) { fulfill(result); });
        });
    });
};

var readOutput = function (stdout) {
    return new promise(function (fulfill, reject) {
        var lines = stdout.split("\n");
        lines.forEach(function(element) {
            if(element.trim().indexOf('Volume Free Space') == 0){
                fulfill(element.trim());
            }
        }, this);
    })
}