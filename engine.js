var Engine = (function(dimention) {
    "use strict";
    var module = {};

    // private variables
    var block = [];
    var dir;

    // private methods

    function checkState(field) {
        if (block.length !== 0 && !canBeMoved(field, down)) {
            mergeBlock(field);
        }
    }

    // merges an active block with the field if block can't move down anymre    
    function mergeBlock(field) {
        block.forEach(function(item) {
            field[item.y][item.x] = dir;
        });
        block = [];
        // check if line should be blowed up
        checkLines(field);
    }

    // checking that all elements of each line marked in positive or negative numbers
    function checkLines(field) {
        for (var y = 0; y < dimention[1]; y++) {

            var lineComplete = field[y].every(function(item, x) {
                return field[y][x] === field[y][(x + 1) % dimention[0]];
            });

            // ..and if so, line swaps its color
            if (lineComplete) {
                for (var x = 0; x < dimention[0]; x++) {
                    field[y][x] = Render.isNeutral(x, y) ? 0 : -field[y][x];
                }

                // ..and all top blocks fall
                if (dir === 1) { // fall down
                    for (var row = y - 1; row >= 0; row--) {
                        for (var col = 0; col < dimention[0]; col++) {
                            if (field[row][col] === dir / Math.abs(dir)) {
                                moveCell(field, { x: col, y: row }, down);
                            }
                        }
                    }
                } else { // fall up
                    for (var row = y + 1; row < dimention[1]; row++) {
                        for (var col = 0; col < dimention[0]; col++) {
                            if (field[row][col] === dir / Math.abs(dir)) {
                                moveCell(field, { x: col, y: row }, down);
                            }
                        }
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

    // move given cell and return cells new coordinates    
    function moveCell(field, cell, direction) {
        var markup = field[cell.y][cell.x]; // markup is a number on a field
        field[cell.y][cell.x] = Render.isNeutral(cell.x, cell.y) ? 0 : -markup / Math.abs(markup); // mark prev position as opposite to our field color
        var newX = direction(cell).x; // eval new position regarding moving direction
        var newY = direction(cell).y;
        field[newY][newX] = markup; // assign our markup to new position on the field
        return { x: newX, y: newY }; // return cells new coordinates
    }

    function moveBlock(field, direction) {
        if (!field || !canBeMoved(field, direction)) return;
        //console.log('move from ' + block[0].x + ':' + block[0].y + ' to ' + direction(block[0]).x + ':' + direction(block[0]).y);

        block = block.map(function(blockCell) {
            return moveCell(field, blockCell, direction);
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
            moveBlock(field, left);
        }
        if (keypress === 100) {//d
            moveBlock(field, right);
        }
        if (keypress === 115) {//s
            moveBlock(field, down);
        }
        keypress = 0;
    }

    // public methods
    module.tick = function(field, keypress) {
        if (block.length === 0) {
            initBlock(field);
            //console.info('init..');
        } else {
            moveBlock(field, down);
        }
        //console.log("before pa");
        playerAction(field, keypress);
        checkState(field);
        return field;
    }

    module.setDir = function(val) {
        dir = val;
    }

    return module;
} (field_dimention));
