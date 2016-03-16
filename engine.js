var Engine = (function(dimention) {
    "use strict";
    var module = {};

    // private variables
    var field = [];
    var block = [];
    var dir;

    function checkState() {
        if (!canBeMoved(down)) { // if block can't move down anymre
            mergeBlock();
            checkLines();
        }
    }

    // merges an active block with the field 
    function mergeBlock() {
        block.forEach(function(blockCell) {
            field[blockCell.y][blockCell.x] = dir;
        });
        block = [];
    }

    // check for complete lines and blow'em up
    function checkLines() {
        for (var y = 0; y < dimention[1]; y++) {
            var lineComplete = field[y].every(function(cell, x) {
                return field[y][x] === field[y][(x + 1) % dimention[0]];
            });
            // ..and if so, blow the line up
            if (lineComplete) {
                if (debug) { Render.drawState(field); debugger; }
                for (var x = 0; x < dimention[0]; x++) {
                    field[y][x] = Render.isNeutral(x, y) ? 0 : -field[y][x];
                }
                if (debug) { Render.drawState(field); debugger; }
                // ..and make all top blocks fall
                if (dir === 1) { // ..down
                    for (var row = y - 1; row >= 0; row--) {
                        moveLineDown(row);
                    }
                } else { // ..up
                    for (var row = y + 1; row < dimention[1]; row++) {
                        moveLineDown(row);
                    }
                }
                if (debug) { Render.drawState(field); debugger; }
            }
        }
    }

    function moveLineDown(row) {
        for (var col = 0; col < dimention[0]; col++) {
            var cell = { x: col, y: row };
            if (field[row][col] === dir / Math.abs(dir)) {
                if (checkCell(cell, down) === 0) {
                    moveCell(cell, down2x);
                } else {
                    moveCell(cell, down);
                }
            }
        }
    }

    // rerurn current state of next position for a given cell
    function checkCell(cell, direction) {
        return field[direction(cell).y][direction(cell).x];
    }

    // init new falling block
    function initBlock() {
        block = [{ x: dimention[0] / 2, y: dir > 0 ? 0 : dimention[1] - 1 }];
        block.forEach(function(cell) {
            field[cell.y][cell.x] = dir * 2;
        });
    };

    // returns true if 'block' could be moved in 'direction' direction and false otherwise
    function canBeMoved(direction) {
        return block.every(function(blockCell) {
            var p = direction(blockCell); // next state
            // check for boundaries and elements of the same type
            return p.y >= 0 && p.x >= 0 && p.y < dimention[1] && p.x < dimention[0] && field[p.y][p.x] !== dir && field[p.y][p.x] !== -2 * dir;
        });
    }

    // move given cell and return cells new coordinates    
    function moveCell(cell, direction) {
        var state = field[cell.y][cell.x];
        field[cell.y][cell.x] = Render.isNeutral(cell.x, cell.y) ? 0 : -state / Math.abs(state); // mark prev position as opposite to our field color
        var p = direction(cell);   // eval new position regarding moving direction
        field[p.y][p.x] = state;   // assign our state to new position on the field
        return { x: p.x, y: p.y }; // return cells new coordinates
    }

    function moveBlock(direction) {
        if (canBeMoved(direction)) {
            block = block.map(function(blockCell) {
                return moveCell(blockCell, direction);
            });
        }
    }

    function down(cell) {
        return { x: cell.x, y: cell.y + dir };
    }

    function down2x(cell) {
        return { x: cell.x, y: cell.y + 2 * dir };
    }    

    function left(cell) {
        return { x: cell.x - 1, y: cell.y };
    }

    function right(cell) {
        return { x: cell.x + 1, y: cell.y };
    }

    function playerAction(keypress) {
        if (keypress === 0) {
            return;
        }
        if (keypress === 97) {  // a
            moveBlock(left);
        }
        if (keypress === 100) { // d
            moveBlock(right);
        }
        if (keypress === 115) { // s
            moveBlock(down);
        }
        keypress = 0;
    }

    module.tick = function(fieldState, keypress) {
        field = fieldState;
        if (block.length === 0) {
            initBlock();
        } else {
            moveBlock(down);
        }
        playerAction(keypress);
        checkState();
        return field;
    }

    module.setDir = function(val) {
        dir = val;

        // for debug in unit tests only. Otherwise 'block' would be interprited incorrectly after change of dir
        var oldBlock = block;
        block = JSON.parse(localStorage.getItem('block'));
        localStorage.setItem('block', JSON.stringify(oldBlock));
    }

    return module;
} (field_dimention));