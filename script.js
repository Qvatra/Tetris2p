var db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');
var room = {};           // local object (not db reference) that contains room info
var playerId;            // TODO: make it specific to device or ip (or guid?)

var block = null;
var dir;
var keyPress=0;
var field = room.field;

$(document).ready(function() {
    $('#idInput').val(localStorage.getItem('playerId') || 'Player1'); // if playerId saved in localStorage - use it

    $('#join').on('click', function() {
        playerId = $('#idInput').val();
        localStorage.setItem('playerId', playerId); // save playerId to localStorage

        if (!room.p1 && !room.p2) {
            db.child("room/p1").set(playerId);      // set 1st
            dir = 1;
        } else if (room.p1 && !room.p2 && room.p1 !== playerId) {
            db.child("room/p2").set(playerId);      // set 2nd
            dir = -1;
        } else {
            console.info('already joined..');
        }
    });

    $(document).keypress(function(e){
      keypress = e;
    });

    db.child("room/field").once("value", function(snapshot){
      setInterval(tick(),1000);
    });


    function tick() {
      if (block === null) {
        initBlock();
      } else {
        move(down);
      }
      playerAction();
      checkState();
    }

    function checkState(){
      checkBlock();
      checkLines();
    }

    function checkBlock() {
      if (block === null) {
        return;
      }
      var blockStopped = false;
      block.forEach(function(item, idx) {
        if (field[item.x][item.y+dir] === dir) {
          blockStopped = true;
        }
      });
      if (blockStopped) {
        db.child("room/field").transaction(function (current_value) {
          if (current_value === null) {
            return;
          }
          block.forEach(function(item, idx) {
              current_value[item.x][item.y] = dir;
          });
          return current_value;
        });
        block = null;
      }
    }

    function checkLines() {
      db.child("room/field").transaction(function (current_value) {
        if (current_value === null) {
          return;
        }
        current_value.forEach(function(item, idx) {
          var sign = item[0];
          var lineComplete = true;
          item.forEach(function(item2, idx2){
            if (item2 * sign < 0) {
              lineComplete = false;
            }
          });
          if (lineComplete) {
            item.forEach(function(item2, idx2){
              item2 = -item2;
            });
          }
        });
        return current_value;
      });
    }

    function initBlock() {
      block = [{x:3,y:(5*(1-dir))}];
      db.child("room/field").transaction(function (current_value) {
        if (current_value === null) {
          return;
        }
        block.forEach(function(item, idx) {
            current_value[item.x][item.y] = dir*2;
        });
        return current_value;
      });
    }

    function move(direction) {
      db.child("room/field").transaction(function (current_value) {
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
      db.child("room/field").transaction(function (current_value) {
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
      if(keyPress===0) {
        return;
      }
      console.log(keyPress);
      keyPress = 0;
    }

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
