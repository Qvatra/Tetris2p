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
            case 0:
                color = colors.holes;
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
                        "stroke-width": 0.5,
                        "stroke-opacity": 0.2
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
                val = module.isNeutral(x, y) ? 0 : y >= dimention[1] / 2 ? 1 : -1;
                field[y].push(val);
            }
        }
        return field;
    }

    // returns true if given x, y reserved as neutral field cell    
    module.isNeutral = function(x, y) {
        return dimention[0] - x - 1 === (dimention[1] - y - 1) % dimention[0];
    }

    // returns field as a formatted string
    module.jsonField = function(field) {
        var result = '';
        if (field) {
            field.forEach(function(row, y) {
                row.forEach(function(cell, x) {
                    var val = cell.toString();
                    var formatted = val.length > 1 ? val : ' ' + val;
                    result = result + formatted + ' ';
                })
                result = result + '\n';
            })
        }
        return result;
    }

    return module;
} (field_dimention, field_size, field_colors));

//Render.drawState(Render.generateField());