$(document).ready(function() {
    Engine.setDir(-1);
    var field = Render.generateField();
    $('#testResults').html(Render.jsonField(field));

    $('#start').on('click', function() {
        field = Engine.tick(field, 0); //97, 100, 115
        $('#testResults').html(Render.jsonField(field));
    });
});
