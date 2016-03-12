var db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');
var room = {};           // local object (not db reference) that contains room info
var playerId;            // TODO: make it specific to device or ip (or guid?)

$(document).ready(function() {
    $('#idInput').val(localStorage.getItem('playerId') || 'Player1'); // if playerId saved in localStorage - use it

    $('#join').on('click', function() {
        playerId = $('#idInput').val();
        localStorage.setItem('playerId', playerId); // save playerId to localStorage

        if (!room.p1 && !room.p2) {
            db.child("room/p1").set(playerId);      // set 1st
        } else if (room.p1 && !room.p2 && room.p1 !== playerId) {
            db.child("room/p2").set(playerId);      // set 2nd
        } else {
            console.info('already joined..');
        }
    });

    db.on("value", function(snapshot) {
        room = snapshot.val() ? snapshot.val().room : {};
        $('#dbcontent').html(JSON.stringify(room, null, 2));
    }, function(errorObject) {
        $('#dbcontent').html("The read failed: " + errorObject.code);
        room = {};
    });

    $('#clear').on('click', function() {
        db.remove();
    });

    $('#start').on('click', function() {
        setInterval(function() {
            console.log('tick');
        }, 1000);
    });   

});