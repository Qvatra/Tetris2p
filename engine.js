var Engine = (function(dimention) {
    "use strict";
    var module = {};

    // private variables
    var keyPress = 0;
    var block = [];
    var dir;

    // private methods   
    function checkState() {
        checkBlock();
        checkLines();
    }

    // what is does??     
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
            Api.change("room/field", function(current_value) {
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

    // what is does??    
    function checkLines() {
        Api.change("room/field", function(current_value) {
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
        block = [{ x: dimention[0] / 2, y: dimention[1] / 2 * (1 - dir) - 1 }];
        Api.change("room/field", function(current_value) {
            if (current_value === null) {
                return;
            }
            block.forEach(function(item) {
                current_value[item.y][item.x] = dir * 2;
            });
            return current_value;
        });
    };

    function move(direction) {
        Api.change("room/field", function(current_value) {
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

    $(document).ready(function() {
        $(document).keypress(function(e) {
            console.log('pressed: ', e.keyCode);
            keypress = e;
        });
    });

    // public variables

    // public methods    
    module.tick = function() {
        console.info('tick');
        if (block.length === 0) {
            initBlock();
        } else {
            move(down);
        }
        playerAction();
        checkState();
    }

    module.setDir = function(val) {
        dir = val;
    }

    return module;
} (field_dimention));