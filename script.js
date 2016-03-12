var db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');
var root = this;
var p1, p2;

$(document).ready(function() {
    $('#nameInput').val('Player1');

    $('#start').on('click', function(e) {
        var name = $('#nameInput').val();
        var room = db.child("room");
        if (room && !room.p1) { //we are 1st
            room.set({ p1: name });
            root.p1 = name;
            room.once('child_added', function() {
                root.p2 = room.child("p2");
            })
        } else { // we are 2nd
            room.set({ p2: name }); // add but replace room.child('p2').set(name)
            root.p1 = room.p1;
            root.p2 = name;
        }
    });

    db.on("value", function(snapshot) {
        $('#dbcontent').html(JSON.stringify(snapshot.val(), null, 2));
    }, function(errorObject) {
        $('#dbcontent').html("The read failed: " + errorObject.code);
    });

});