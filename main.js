$(document).ready(function() {
    var room = {};           // local object (not db reference) that contains room info
    var playerId;            // TODO: make it specific to device or ip (or guid?)
    var isStarted;
    var keypress = 0;

    $('#idInput').val(localStorage.getItem('playerId') || 'Player1'); // if playerId saved in localStorage - use it

    $('#join').on('click', function() {
        playerId = $('#idInput').val();
        localStorage.setItem('playerId', playerId); // save playerId to localStorage

        if (!room.p1 && !room.p2) {
            Engine.setDir(1);
            Api.save("room/p1", { id: playerId, dir: 1 }); // set 1st
        } else if (room.p1 && !room.p2 && room.p1 !== playerId) {
            Engine.setDir(-1);
            Api.save("room/p2", { id: playerId, dir: -1 }); // set 2nd
            Api.save("room/field", Render.generateField());
        } else {
            console.info('already joined..');
        }
    });

    Api.db.on("value", function(snapshot) {
        room = snapshot.val() ? snapshot.val().room : {};

        $('#dbcontent').html(Render.jsonField(room.field) + '\n' + JSON.stringify(Object.assign({}, room, { field: undefined }), null, 2));

        if (room.field) {
            Render.drawState(room.field);

            if (!isStarted) {
                console.info('Field was found. Started..');
                if (Object.keys(room).length !== 0) {
                    Engine.setDir(room[room.p1.id === playerId ? 'p1' : 'p2'].dir);
                }
                isStarted = setInterval(tick, 1000);
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
        clearInterval(isStarted);
        Api.remove('room');
    });

    $('#clearField').on('click', function() {
        clearInterval(isStarted);
        Api.remove('room/field');
    });

    $(document).keypress(function(e) {
        keypress = e.keyCode;
    });

    function tick() {
        Api.change("room/field", function(current_value) {
            if (current_value === null)
                return;
            return Engine.tick(current_value, keypress);
        });
        keypress = 0;
    }

});
