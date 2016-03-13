var Render = (function(dimention, size, colors) {
    "use strict";
    var module = {};

    // private variables
    var width = dimention[0] * size;
    var height = dimention[1] * size;
    var paper = Raphael(9, 40, width, height);

    // private methods   
    function getColor(cell) {
        var color;
        switch (cell) {
            case 1:
                color = colors.field[0];
                break;
            case -1:
                color = colors.field[1];
                break;
            case 2:
                color = colors.block[0];
                break;
            case -2:
                color = colors.block[1];
                break;
            case 3:
                color = colors.holes[0];
                break;
            case -3:
                color = colors.holes[1];
                break;
            default:
                color = 'red';
        }
        return color;
    }

    // public methods    
    module.drawState = function(field) {
        field.forEach(function(row, y) {
            row.forEach(function(cell, x) {
                var rect = paper.rect(x * size, y * size, size, size)
                    .attr({
                        fill: getColor(cell),
                        stroke: cell > 0 ? colors.field[1] : colors.field[0],
                        "stroke-width": 0.5
                    });
            });
        });
    }

    // works for even x and y only
    module.generateField = function() {
        var field = [];
        var val;

        // make a half on half field with holes
        for (var y = 0; y < dimention[1]; y++) {
            field.push([]);
            for (var x = 0; x < dimention[0]; x++) {
                if (y >= dimention[1] / 2) {
                    val = (dimention[0] - x - 1 === (dimention[1] - y - 1) % dimention[0]) ? 3 : 1;
                } else {
                    val = (x === y % dimention[0]) ? -3 : -1;
                }
                field[y].push(val);
            }
        }
        return field;
    }

    // returns field as a formatted string
    module.jsonField = function(field) {
        var result = '';
        if (field) {
            field.forEach((row, y) => {
                row.forEach((cell, x) => {
                    var val = cell.toString();
                    var formatted = val.length > 1 ? val : ' ' + val;
                    result = result + formatted + ' ';
                })
                result = result + '\n';
            })
        }
        console.log(result);
        return result;
    }

    return module;
} (field_dimention, field_size, field_colors));

//Render.drawState(Render.generateField());