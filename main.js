$(document).ready(function() {
    var room = {};           // local object (not db reference) that contains room info
    var playerId;            // TODO: make it specific to device or ip (or guid?)
    var tickStarted;
    var keypress = 0;
    var field = undefined;

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
        if (field && (!snapshot.val() || !snapshot.val().room.field)) location.reload();

        room = snapshot.val() ? snapshot.val().room : {};

        $('#dbcontent').html(Render.jsonField(room.field) + '\n' + JSON.stringify(Object.assign({}, room, { field: undefined }), null, 2));
        
        field = room.field;
        if (field) {
            //Render.drawState(field);

            if (!tickStarted) {
                if (Object.keys(room).length !== 0) {
                    Engine.setDir(room[room.p1.id === playerId ? 'p1' : 'p2'].dir);
                }
                console.info('Field was found. Started.., dir = ', room[room.p1.id === playerId ? 'p1' : 'p2'].dir);
                tickStarted = setInterval(tick, 200);
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

    $('#left').mousedown(function() {
        keypress = 37;
    });    
    $('#right').mousedown(function() {
        keypress = 39;
    });
    $('#down').mousedown(function() {
        keypress = 40;
    });
    $('#drop').mousedown(function() {
        keypress = 32;
    });
    $('#up').mousedown(function() {
        keypress = 38;
    });

    function tick() {
        var newField = Engine.tick(field, keypress, true);
               
        Render.drawState(newField);
                
        newField.forEach(function(row, y) {
            row.forEach(function(cell, x) {
                if (field && field[y][x] !== cell) { // save to db changed cells only
                    Api.save("room/field/" + y + "/" + x, cell); // ??? consider transaction for cell
                }
            });
        });
        keypress = 0;
    }

});


// function tick() {
//     var newField = Engine.tick(field, keypress, false);
//     if (JSON.stringify(field) != JSON.stringify(newField)) {
//         Api.change("room/field", function(current_value) {
//             if (current_value === null)
//                 return;
//             return newField;
//         });
//     }
//     keypress = 0;
// }