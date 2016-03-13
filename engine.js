var Engine = (function(dimention) {
    "use strict";
    var module = {};

    // private variables
    var block = [];
    var dir;

    // private methods
    // merges an active block with the field    
    function checkState(field, direction) {
        if (block.length !== 0 && !canBeMoved(field, direction)) {
            block.forEach(function(item) {
                field[item.y][item.x] = dir;
            });
            block = [];
            // check if line should be blowed up
            checkLines(field);            
        }
    }

    // checking that all elements of each line marked in positive or negative numbers
    function checkLines(field) {
        for (var i = 0; i < field.length; i++) {
            if (field[i][0] !== 0) {
                var sign = field[i][0] > 0 ? 1 : -1;
                var lineComplete = field[i].every(function(item2, idx2) {
                    return item2 * sign === 1;
                });
                // and if so, line swap it color
                if (lineComplete) {
                    for (var j = 0; j < field[i].length; j++) {
                        field[i][j] = Render.isNeutral(j, i) ? 0 : -sign;
                    }
                }
            }
        }
    }

    // init new falling black
    function initBlock(field) {
        block = [{ x: dimention[0] / 2, y: dir > 0 ? 0 : dimention[1] - 1 }];
        block.forEach(function(item) {
            field[item.y][item.x] = dir * 2;
        });
    };

    // returns true if 'block' could be moved in 'direction' direction and false otherwise
    function canBeMoved(field, direction) {
        return block.every(function(item) {
            // next position
            var p = direction(item);
            // check for boundaries and elements of the same type
            return field[p.y][p.x] !== dir && field[p.y][p.x] !== -2 * dir && p.y >= 0 && p.x >= 0 && p.y < dimention[1] && p.x < dimention[0];
        });
    }

    function move(field, direction) {
        if (!field || !canBeMoved(field, direction)) return;
        //console.log('move from ' + block[0].x + ':' + block[0].y + ' to ' + direction(block[0]).x + ':' + direction(block[0]).y);

        // mark all field's points in opposite color
        block.forEach(function(item) {
            field[item.y][item.x] = Render.isNeutral(item.x, item.y) ? 0 : -dir;
        });

        // replace block's element, moving them
        block = block.map(function(item) {
            return direction(item);
        });

        // mark field's points under block
        block.forEach(function(item) {
            field[item.y][item.x] = dir * 2;
        });
    }

    function down(item) {
        return { x: item.x, y: item.y + dir };
    }

    function left(item) {
        return { x: item.x - 1, y: item.y };
    }

    function right(item) {
        return { x: item.x + 1, y: item.y };
    }

    function playerAction(field, keypress) {
        //console.log("in pa");
        if (keypress === 0) {
            return;
        }
        if (keypress === 97) {//a
            move(field, left);
        }
        if (keypress === 100) {//d
            move(field, right);
        }
        if (keypress === 115) {//s
            move(field, down);
        }
        keypress = 0;
    }

    // public methods
    module.tick = function(field, keypress) {
        if (block.length === 0) {
            initBlock(field);
            //console.info('init..');
        } else {
            move(field, down);
        }
        //console.log("before pa");
        playerAction(field, keypress);
        checkState(field, down);
        return field;
    }

    module.setDir = function(val) {
        dir = val;
    }

    return module;
} (field_dimention));
