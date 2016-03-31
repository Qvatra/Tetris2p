$(document).ready(function() {
    var room = {};           // local object (not db reference) that contains room info
    var playerId;            // TODO: make it specific to device or ip (or guid?)
    var tickStarted;
    var keypress = 0;

    var downTime = Date.now();
    var myTurn = false;
    var myState = undefined;
    
    $('#idInput').val(localStorage.getItem('playerId') || 'Player1'); // if playerId saved in localStorage - use it
    playerId = $('#idInput').val();

    $('#join').on('click', function() {
        playerId = $('#idInput').val();
        localStorage.setItem('playerId', playerId); // save playerId to localStorage

        if (!room.p1 && !room.p2) {
            Api.save("room/p1", { id: playerId, dir: 1 }); // set 1st
        } else if (room.p1 && !room.p2 && room.p1 !== playerId) {
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

            if (!tickStarted) {
                console.info('Field was found. Started..');
                if (Object.keys(room).length !== 0) {
                    var myDir = room[room.p1.id === playerId ? 'p1' : 'p2'].dir;
                    if (myDir === 1) myTurn = true;
                    Engine.setDir(myDir);
                    myState = room.field;
                }
                console.info('myTurn', myTurn, 'myDir', myDir);
                tickStarted = setInterval(tick, 100);
            }

            if (myState && JSON.stringify(myState) != JSON.stringify(room.field)) {
                myTurn = true;
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
    });

    $('#clearField').on('click', function() {
        clearInterval(tickStarted);
        Api.remove('room/field');
    });

    $(document).keydown(function(e) {
        keypress = e.keyCode;
    });

    function tick() {
        if (myTurn) {
            console.log('my turn');
            Api.change("room/field", function(current_value) {
                if (current_value === null)
                    return;
                myState = Engine.tick(current_value, keypress);
                return myState;
            });
            myTurn = false;
            keypress = 0;
        } else {
            console.log('openent turn');
        }
    }

    // function KeyboardTick() {
    //     Api.change("room/field", function(current_value) {
    //         if (current_value === null || keypress === 0)
    //             return;
    //         return Engine.keyboardTick(current_value, keypress);
    //     });
    //     keypress = 0;
    // }

});


    // function tick() {
    //     var now = Date.now();
    //     if (now - downTime > 1000) {
    //         Engine.playerMoveAndMoveDown();
    //         downTime = now;
    //     } 
    //     Engine.playerMove();
    // }