$(document).ready(function() {
    var dir = 1;
    var ctrl = 0;

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

    $('#tick').on('click', function() {
        field = Engine.keyboardTick(field, ctrl);
        refresh();
    });

    $('#flip').on('click', function() {
        dir = -dir;
        Engine.setDir(dir);
        refresh();
    });

    $('#left').on('click', function() {
        ctrl = 97;
        refresh();
    });
    $('#down').on('click', function() {
        ctrl = 115;
        refresh();
    });
    $('#right').on('click', function() {
        ctrl = 100;
        refresh();
    });
    $('#noctrl').on('click', function() {
        ctrl = 0;
        refresh();
    }); 

    function refresh() {
        $('#testResults').html(Render.jsonField(field) + '\n dir = ' + dir + '\n ctrl = ' + ctrl);
        Render.drawState(field);
    }

    localStorage.setItem('block', '[]');    

});
