var Api = (function() {
    "use strict";
    var module = {};

    // public variables    
    module.db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');

    // public methods 
    module.save = function(path, val) {
        module.db.child(path).set(val);
    }

    module.change = function(path, func) {
        module.db.child(path).transaction(func);
    }

    module.remove = function(path) {
        module.db.child(path).remove();
    }

    return module;
} ());