$(document).ready(function() {
  $('#start').on('click', function() {
    $('#testResults').append("<p>seting up the engine</p>");
    var field = Render.generateField();
    $('#testResults').append(Render.jsonField(field));
    Engine.setDir(1);
    var field2 = Engine.tick(field,0);
    $('#testResults').append(Render.jsonField(field));
  });
});
