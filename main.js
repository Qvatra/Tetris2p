$(document).ready(function() {
    var room = {};           // local object (not db reference) that contains room info
    var playerId;            // TODO: make it specific to device or ip (or guid?)
    var tickStarted;
    var keypress = 0;
    var myState;
    
    $('#idInput').val(localStorage.getItem('playerId') || 'Player1'); // if playerId saved in localStorage - use it
    playerId = $('#idInput').val();

    $('#join').on('click', function() {
        playerId = $('#idInput').val();
        localStorage.setItem('playerId', playerId); // save playerId to localStorage

        if (!room.p1 && !room.p2) {
            Api.save("room/p1", { id: playerId, dir: 1 }); // set 1st
        } else if (room.p1 && !room.p2 && room.p1.id !== playerId) {
            Api.save("room/p2", { id: playerId, dir: -1 }); // set 2nd
            Api.save("room/field", Render.generateField());
        } else {
            console.info('already joined..');
        }
    });

    Api.db.on("value", function(snapshot) {
        room = snapshot.val() ? snapshot.val().room : {};

        $('#dbcontent').html(Render.jsonField(room.field) + '\n' + JSON.stringify(Object.assign({}, room, { field: undefined }), null, 2));

        myState = room.field;        
        if (myState) {
            Render.drawState(myState);

            if (!tickStarted) {
                if (Object.keys(room).length !== 0) {
                    Engine.setDir(room[room.p1.id === playerId ? 'p1' : 'p2'].dir);
                }
                console.info('Field was found. Started.., dir = ', room[room.p1.id === playerId ? 'p1' : 'p2'].dir);
                tickStarted = setInterval(tick, 100);
            }
        }
    }, function(errorObject) {
        $('#dbcontent').html("The read failed: " + errorObject.code);
        room = {};
    });

    $('#start').on('click', function() {
        Api.save("room/field", Render.generateField());
    });

    $('#clearDb').on('click', function() {
        clearInterval(tickStarted);
        Api.remove('room');
        location.reload();
    });

    $('#clearField').on('click', function() {
        clearInterval(tickStarted);
        Api.remove('room/field');
        location.reload();
    });

    $(document).keydown(function(e) {
        keypress = e.keyCode;
    });

    function tick() {
        var oldStateString = JSON.stringify(myState);
        var newState = Engine.tick(myState, keypress, false);
        if ( oldStateString != JSON.stringify(newState)) {
            //console.log('newState', newState);
            Api.change("room/field", function(current_value) {
                if (current_value === null)
                    return;
                return newState;
            });
        }
        keypress = 0;
    }

});
