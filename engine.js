var Engine = (function(dimention) {
    var module = {};

    // private variables
    var block = [];
    var dir;

    // private methods
    function checkState(field) {
        checkBlock(field);
        checkLines(field);
    }

    // check that block cant move down; if so block converts in field element
    function checkBlock(fiels) {
        if (block.length === 0) {
            return;
        }
        //analyze elements under block
        var blockStopped = false;
        block.forEach(function(item, idx) {
            var p = direction(item); //point under block point
            if (field[p.y][p.x] === dir) {
              blockStopped = true;
            }
        });
        //field points, marked as "block", is setting as plain field elements
        if (blockStopped) {
            block.forEach(function(item, idx) {
                field[item.x][item.y] = dir;
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

    function move(field, direction) {
        if (field === null) {
            return;
        }
        //check, that we can move in choosen direction
        block.forEach(function(item, idx) {
            var p = direction(item);
            if (field[p.y][p.x] === dir) {
              return;
            }
        });
        //mark all field's points in opposite color
        block.forEach(function(item, idx) {
            field[item.y][item.x] = -dir;
        });
        // replace block's element, moving them
        block.forEach(function(item, idx) {
            item = direction(item);
        });
        //mark field's points under block
        block.forEach(function(item, idx) {
            field[item.y][item.x] = dir * 2;
        });
    }

    function down(item) {
        return {x:item.x, y:item.y + dir};
    }

    function left(item) {
        return {x:item.x-1, y:item.y};
    }

    function right(item) {
        return {x:item.x+1, y:item.y};
    }

    function playerAction() {
        if (keyPress === 0) {
            return;
        }
        console.log(keyPress);
        keyPress = 0;
    }

    // public variables

    // public methods
    module.tick = function(field, keypress) {
        // console.info('tick');
        // if (block.length === 0) {
        //     initBlock(field);
        // } else {
        //     move(field, down);
        // }
        // playerAction(field, keypress);
        // checkState(field);
        return field;
    },

    module.setDir = function(val) {
        dir = val;
    }

    return module;
} (field_dimention));
