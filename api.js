var Api = (function() {
    "use strict";
    var module = {};

    // public variables    
    module.db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');

    // public methods 
    module.save = function(path, val) {
        //console.warn('Api: save ' + path);
        module.db.child(path).set(val);
    }

    module.change = function(path, func) {
        //console.warn('Api: change ' + path);
        module.db.child(path).transaction(func);
    }

    module.remove = function(path) {
        //console.warn('Api: remove ' + path);
        module.db.child(path).remove();
    }

    return module;
} ());