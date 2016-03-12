var db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');
var room = {};           // local object (not db reference) that contains room info
var playerId;            // TODO: make it specific to device or ip (or guid?)
var fieldArr = [
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 1],
    [-1, -1, -1, 1, 1],
    [-1, -1, 1, 1, 1],
    [-1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]];

var block = [];
var dir;
var keyPress = 0;
var isStarted;

$(document).ready(function() {
    $('#idInput').val(localStorage.getItem('playerId') || 'Player1'); // if playerId saved in localStorage - use it

    $('#join').on('click', function() {
        playerId = $('#idInput').val();
        localStorage.setItem('playerId', playerId); // save playerId to localStorage

        if (!room.p1 && !room.p2) {
            dir = 1;
            db.child("room/p1").set({ id: playerId, dir: dir });      // set 1st
        } else if (room.p1 && !room.p2 && room.p1 !== playerId) {
            dir = -1;
            db.child("room/p2").set({ id: playerId, dir: dir });      // set 2nd
            db.child("room/field").set(fieldArr);
        } else {
            console.info('already joined..');
        }
    });

    $(document).keypress(function(e) {
        keypress = e;
    });

    function tick() {
        console.log('tick');
        if (block.length === 0) {
            initBlock();
        } else {
            move(down);
        }
        playerAction();
        checkState();
    }

    function checkState() {
        checkBlock();
        checkLines();
    }

    function checkBlock() {
        if (block.length === 0) {
            return;
        }
        var blockStopped = false;
        block.forEach(function(item, idx) {
            if (room.field[item.x][item.y + dir] === dir) {
                blockStopped = true;
            }
        });
        if (blockStopped) {
            db.child("room/field").transaction(function(current_value) {
                if (current_value === null) {
                    return;
                }
                block.forEach(function(item, idx) {
                    current_value[item.x][item.y] = dir;
                });
                return current_value;
            });
            block = [];
        }
    }

    function checkLines() {
        db.child("room/field").transaction(function(current_value) {
            if (current_value === null) {
                return;
            }
            current_value.forEach(function(item, idx) {
                var sign = item[0];
                var lineComplete = true;
                item.forEach(function(item2, idx2) {
                    if (item2 * sign < 0) {
                        lineComplete = false;
                    }
                });
                if (lineComplete) {
                    item.forEach(function(item2, idx2) {
                        item2 = -item2;
                    });
                }
            });
            return current_value;
        });
    }

    // init new falling black    
    function initBlock() {
        block = [{ x: 3, y: (5 * (1 - dir)) }];
        db.child("room/field").transaction(function(current_value) {
            if (current_value === null) {
                return;
            }
            block.forEach(function(item, idx) {
                current_value[item.x][item.y] = dir * 2;
            });
            return current_value;
        });
    }

    function move(direction) {
        db.child("room/field").transaction(function(current_value) {
            if (current_value === null) {
                return;
            }
            block.forEach(function(item, idx) {
                current_value[item.x][item.y] = -dir;
            });
            block.forEach(function(item, idx) {
                item = direction(item);
            });
            block.forEach(function(item, idx) {
                current_value[item.x][item.y] = dir;
            });
            return current_value;
        });
    }

    function move(direction) {
        db.child("room/field").transaction(function(current_value) {
            if (current_value === null) {
                return;
            }
            block.forEach(function(item, idx) {
                current_value[item.x][item.y] = -dir;
            });
            block.forEach(function(item, idx) {
                item = direction(item);
            });
            block.forEach(function(item, idx) {
                current_value[item.x][item.y] = dir;
            });
            return current_value;
        });
    }

    function down(item) {
        item.y = item.y + dir;
        return item;
    }

    function left(item) {
        item.x = item.x - 1;
        return item;
    }

    function right(item) {
        item.x = item.x + 1;
        return item;
    }

    function playerAction() {
        if (keyPress === 0) {
            return;
        }
        console.log(keyPress);
        keyPress = 0;
    }

    db.on("value", function(snapshot) {
        room = snapshot.val() ? snapshot.val().room : {};
        if (room.field) drawState(room.field);
        // $('#dbcontent').html(JSON.stringify(room, null, 2));
        // console.info(JSON.stringify(room, null, 2));

        if (room.field && !isStarted) {
            if (Object.keys(room).length !== 0) {
                dir = room[room.p1.id === playerId ? 'p1' : 'p2'].dir;
            }
            isStarted = setInterval(tick, 1000);
        }        
    }, function(errorObject) {
        $('#dbcontent').html("The read failed: " + errorObject.code);
        room = {};
    });

    $('#clear').on('click', function() {
        clearInterval(isStarted);
        db.remove();
    });

    $('#start').on('click', function() {
        setInterval(function() {
            console.log('tick');
        }, 1000);
    });

    function fieldInit() {
        db.child("room/field").set(fieldArr);
    }

    
});