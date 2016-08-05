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
            },
            function(info) {
                res.status(500).send(info);
            });
});

app.listen(port, function(){
    console.log("Server listening on port %s.", port);
});

var fsFreeSpace = function(){
    return new promise(function(fulfill, reject){
        var command = "diskutil info disk1";
        child = exec(command, function(error, stdout, stderr){
            //stderr = "Command not found.";
            //error = "WTF!";
            if(error){
                reject("Error: Could not issue the command.");
                console.error(error);
            }
            if(stderr.length > 0){
                reject("Error: Command returned an error.");
                console.error(stderr);
            }
            readOutput(stdout).then(function(result) { fulfill(result); }, function(info){ reject(info); });
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
        reject("Volume Free Space not found!");
    })
}