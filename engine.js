var Engine = (function(dimention) {
    "use strict";
    var module = {};

    // private variables
    var block = [];
    var dir;

    // private methods
    function checkState(field, direction) {
        applyBlock(field, direction);
        checkLines(field);
    }

    // merges an active block with the field
    function applyBlock(field, direction) {
        if (block.length !== 0 && !canBeMoved(field, direction)) {
            block.forEach(function(item) {
                field[item.y][item.x] = dir;
            });
            block = [];
        }
    }

    // checking that all elements of each line marked in positive or negative numbers
    function checkLines(field) {
        field.forEach(function(item, idx) {
            var sign = item[0];
            var lineComplete = true;
            item.forEach(function(item2, idx2) {
                if (item2 * sign <= 0) {
                    lineComplete = false;
                }
            });
            // and if so, line swap it color
            if (lineComplete) {
                item.forEach(function(item2, idx2) {
                    item2 = -item2;
                });
            }
        });
    }

    // init new falling black
    function initBlock(field) {
        block = [{ x: dimention[0] / 2, y: dimention[1] / 2 * (1 - dir) - 1 }];
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
            return field[p.y][p.x] !== dir && p.y > 0 && p.x > 0 && p.y < dimention[1] - 1 && p.x < dimention[0] - 1;
        });
    }

    function move(field, direction) {
        if (!field || !canBeMoved(field, direction)) return;
        
        console.log('move from ' + block[0].x + ':' + block[0].y + ' to ' + direction(block[0]).x + ':' + direction(block[0]).y);

        // mark all field's points in opposite color
        block.forEach(function(item) {
            field[item.y][item.x] = -dir;
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

    function playerAction(keypress) {
        if (keypress === 0) {
            return;
        }
        console.log(keypress);
        keypress = 0;
    }

    // public methods
    module.tick = function(field, keypress) {
        if (block.length === 0) {
            initBlock(field);
            console.info('init..');
        } else {
            move(field, down);
        }
        playerAction(keypress);
        checkState(field, down);
        return field;
    }

    module.setDir = function(val) {
        dir = val;
    }

    return module;
} (field_dimention));
