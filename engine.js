var Engine = (function(dimention) {
    "use strict";
    var module = {};

    // Pieces.  (Indexed by piece rotation (0-3), row (0-3), piece number (0-6))
     var PIECES = [];
     for (var i = 0; i < 4; i++) { PIECES[i] = []; }
     PIECES[0][0] = [ "    ",   "    ",   "    ",   "    ",   "    ",   "    ",   "    " ];
     PIECES[0][1] = [ "    ",   "B   ",   "  O ",   " YY ",   " GG ",   " P  ",   "RR  " ];
     PIECES[0][2] = [ "bbbb",   "BBB ",   "OOO ",   " YY ",   "GG  ",   "PPP ",   " RR " ];
     PIECES[0][3] = [ "    ",   "    ",   "    ",   "    ",   "    ",   "    ",   "    " ];
     PIECES[1][0] = [ " b  ",   "    ",   "    ",   "    ",   "    ",   "    ",   "  R " ];
     PIECES[1][1] = [ " b  ",   " B  ",   "OO  ",   " YY ",   " G  ",   " P  ",   " RR " ];
     PIECES[1][2] = [ " b  ",   " B  ",   " O  ",   " YY ",   " GG ",   " PP ",   " R  " ];
     PIECES[1][3] = [ " b  ",   "BB  ",   " O  ",   "    ",   "  G ",   " P  ",   "    " ];
     PIECES[2][0] = [ "    ",   "    ",   "    ",   "    ",   "    ",   "    ",   "    " ];
     PIECES[2][1] = [ "    ",   "    ",   "    ",   " YY ",   " GG ",   "    ",   "RR  " ];
     PIECES[2][2] = [ "bbbb",   "BBB ",   "OOO ",   " YY ",   "GG  ",   "PPP ",   " RR " ];
     PIECES[2][3] = [ "    ",   "  B ",   "O   ",   "    ",   "    ",   " P  ",   "    " ];
     PIECES[3][0] = [ " b  ",   "    ",   "    ",   "    ",   "    ",   "    ",   "  R " ];
     PIECES[3][1] = [ " b  ",   " BB ",   " O  ",   " YY ",   " G  ",   " P  ",   " RR " ];
     PIECES[3][2] = [ " b  ",   " B  ",   " O  ",   " YY ",   " GG ",   "PP  ",   " R  " ];
     PIECES[3][3] = [ " b  ",   " B  ",   " OO ",   "    ",   "  G ",   " P  ",   "    " ];

    // private variables
    var field = [];
    var block = null;
    var dir;

    var forEachBlockOfPiece = function (piece, fn, includeInvalid) {
        for (var blockY = 0; blockY < 4; blockY++) {
          for (var blockX = 0; blockX < 4; blockX++) {
            var colorValue = PIECES[piece.rotation][blockY][piece.pieceNum].charAt(blockX);
            if (colorValue != ' ') {
              var x = piece.x + blockX, y = piece.y + blockY;
              if (includeInvalid || (x >= 0 && x < field_dimention[0] && y >= 0 && y < field_dimention[1])) {
                fn(x, y);
              }
            }
          }
        }
      };

    function checkState() {
        if (!canBeMoved(down)) { // if block can't move down anymre
            mergeBlock();
            checkLines();
        }
    }

    // merges an active block with the field
    function mergeBlock() {
        forEachBlockOfPiece(block,function(x, y) {
            field[y][x] = dir;
        }, false);
        block = null;
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
        block = { x: dimention[0] / 2 - 2, y: dir > 0 ? 0 : dimention[1] - 3, rotation: 0, pieceNum: Math.floor(Math.random() * 7) };
        forEachBlockOfPiece(block, function(x, y) {
            field[y][x] = dir * 2;
        }, false);
    };

    // returns true if 'block' could be moved in 'direction' direction and false otherwise
    function canBeMoved(direction) {
        var can = true;
        forEachBlockOfPiece(block, function(x, y) {
            var p = direction({x:x,y:y}); // next state
            // check for boundaries and elements of the same type
            if (!(p.y >= 0 && p.x >= 0 && p.y < dimention[1] && p.x < dimention[0] && field[p.y][p.x] !== dir && field[p.y][p.x] !== -2 * dir)) {
                can = false;
            }
        }, true);
        return can;
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
            forEachBlockOfPiece(block, function(x, y) {
                var state = field[y][x];
                field[y][x] = Render.isNeutral(x, y) ? 0 : -state / Math.abs(state);
            }, false);
            var p = direction({x:block.x, y:block.y});
            block.x=p.x;
            block.y=p.y;
            forEachBlockOfPiece(block, function(x, y) {
                field[y][x] = dir * 2;
            }, false);
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

    function drop(cell) {
        if (dir === 1) { // ..down
            for (var y = cell.y + 1; y < field_dimention[1]; y++) {
                if (field[y][cell.x] === dir || field[y][cell.x] === -2 * dir) {
                    return { x: cell.x, y: y - 1 };
                }
            }
            return { x: cell.x, y: field_dimention[1] - 1 };
        } else { // ..up
            for (var y = cell.y - 1; y >= 0; y--) {
                if (field[y][cell.x] === dir || field[y][cell.x] === -2 * dir) {
                    return { x: cell.x, y: y + 1 };
                }
            }
            return { x: cell.x, y: 0 };
        }
    }

    var downTime = Date.now();
    function blockAction(keypress, allowFall) {
        if (allowFall) {
            var now = Date.now();
            if (now - downTime > 1000) {
                moveBlock(down);
                downTime = now;
            }
        }
        switch (keypress) {
            case 37:
                moveBlock(left);
                break;
            case 39:
                moveBlock(right);
                break;
            case 40:
                moveBlock(down);
                break;
            case 32:
                moveBlock(drop);
                break;
            case 38:
                rotateBlock();
                break;
        }
        keypress = 0;
    }

    function rotateBlock() {
      var block2 = {x:block.x, y:block.y, pieceNum:block.pieceNum, rotation:((block.rotation+1)%4)};
      var can=true;
      forEachBlockOfPiece(block2, function(x, y) {
          if (!(y >= 0 && x >= 0 && y < dimention[1] && x < dimention[0] && field[y][x] !== dir && field[y][x] !== -2 * dir)) {
            can = false;
          }
      }, true);
      if (can) {
        forEachBlockOfPiece(block, function(x, y) {
            var state = field[y][x];
            field[y][x] = Render.isNeutral(x, y) ? 0 : -state / Math.abs(state);
        }, false);
        block = block2;
        forEachBlockOfPiece(block, function(x, y) {
            field[y][x] = dir * 2;
        }, false);
      }
    }

    module.tick = function(fieldState, keypress, allowFall) {
        field = fieldState.map(function(raw) { return raw.slice() }); // copy 2d array by value

        if (block === null) {
            initBlock();
        } else {
            blockAction(keypress, allowFall);
        }
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
