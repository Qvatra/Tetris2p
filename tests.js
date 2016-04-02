$(document).ready(function() {
    var dir = 1;

    Engine.setDir(dir);
    var field = Render.generateField();

    // var field = [
    //     [ 0, -5, -1, -1, -1, -1],
    //     [ 1,  5, -1, -1, -1, -1],
    //     [ 1, -5,  0, -1, -1, -1],
    //     [ 1, -5, -1,  0, -1, -1],
    //     [ 1, -5, -1, -1,  0, -1],
    //     [ 1, -5, -1, -1, -1,  0],
    //     [ 0,  5, -1, -1,  1, -1],
    //     [ 1,  5, -1, -1,  1, -1],
    //     [ 1,  5,  0, -1,  1, -1],
    //     [ 1,  5,  1,  0,  1, -1],
    //     [ 1,  5,  1,  1,  0, -1],
    //     [ 1,  5,  1,  1,  1,  0]
    // ];

    refresh();

    $('#flip').on('click', function() {
        dir = -dir;
        Engine.setDir(dir);
        refresh();
    });
    $('#left').on('click', function() {
        field = Engine.tick(field, 37, false);
        refresh();
    });
    $('#down').on('click', function() {
        field = Engine.tick(field, 40, false);
        refresh();
    });
    $('#right').on('click', function() {
        field = Engine.tick(field, 39, false);
        refresh();
    });
    $('#drop').on('click', function() {
        field = Engine.tick(field, 32, false);
        refresh();
    });
    $('#up').on('click', function() {
        field = Engine.tick(field, 38, false);
        refresh();
    });
    $(document).keydown(function(e) {
        keypress = e.keyCode;
        field = Engine.tick(field, e.keyCode, false);
        refresh();
    });

    function refresh() {
        $('#testResults').html(Render.jsonField(field) + '\n dir = ' + dir);
        Render.drawState(field);
    }

    localStorage.setItem('block', '[]');    

});
