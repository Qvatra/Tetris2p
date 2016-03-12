$(document).ready(function() { });

var dimention = [5, 10];
var size = 50;
var width = dimention[0] * size;
var height = dimention[1] * size;

var paper = Raphael(9, 40, width, height);

function drawState(field) {
    field.forEach(function(row, y) {
        row.forEach(function(cell, x) {
            var rect = paper.rect(x * size, y * size, size, size)
                .attr({
                    fill: getColor(cell),
                    stroke: cell > 0 ? "white" : "black",
                     "stroke-width": 0.5
                });
        });
    });
}

function getColor(cell) {
    var color;
    switch (cell) {
        case -2:
            color = 'rgb(50,50,50)';
            break;
        case 2:
            color = 'lightgray';
            break;
        case 1:
            color = 'black';
            break;
        default:
            color = 'white';            
    }
    return color;
}


