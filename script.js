var db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');
var root = this;
var p1, p2;

$('#nameInput').keypress(function(e) {
    if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        var room = db.child("room");
        if (room && !room.p1) { //we are 1st
            room.set({ p1: name });
            root.p1 = name;
            room.once('child_added', function() {
                root.p2 = room.child("p2");
            })
        } else { // we are 2nd
            room.set({ p2: name }); // add but replace room.child('p2').set(name)
            root.p1 = room.p1;
            root.p2 = name;
        }
    }
});

db.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
    console.log(message.name, message.text);
});

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

function onstart() {
    console.log(root.p1, root.p2);
}

db.on("value", function(snapshot) {
    $('#dbcontent').html(JSON.stringify(snapshot.val(), null, 2));
}, function(errorObject) {
    $('#dbcontent').html("The read failed: " + errorObject.code);
});