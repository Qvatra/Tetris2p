$(document).ready(function() {
    var dir = 1;

    Engine.setDir(dir);
    var field = Render.generateField();

    // var field = [
    //     [ 0, -1, -1, -1, -1, -1],
    //     [-1,  0, -1, -1, -1, -1],
    //     [-1, -1,  0, -1, -1, -1],
    //     [-1, -1, -1,  0, -1, -1],
    //     [-1, -1, -1, -1,  0, -1],
    //     [-1,  1, -1, -1, -1,  0],
    //     [ 0,  1,  1,  1, -1,  1],
    //     [ 1,  0,  1,  1, -1,  1],
    //     [ 1,  1,  0,  1, -1,  1],
    //     [ 1,  1,  1,  0, -1,  1],
    //     [ 1,  1,  1,  1,  0,  1],
    //     [ 1,  1,  1,  1,  1,  0]
    // ];

    refresh();

    $('#flip').on('click', function() {
        dir = -dir;
        Engine.setDir(dir);
        refresh();
    });
    $('#left').on('click', function() {
        field = Engine.tick(field, 97, false);
        refresh();
    });
    $('#down').on('click', function() {
        field = Engine.tick(field, 115, false);
        refresh();
    });
    $('#right').on('click', function() {
        field = Engine.tick(field, 100, false);
        refresh();
    });

    function refresh() {
        $('#testResults').html(Render.jsonField(field) + '\n dir = ' + dir);
        Render.drawState(field);
    }

    localStorage.setItem('block', '[]');    

});
