var Api = (function() {
    var module = {};

    // public variables    
    module.db = new Firebase('https://blinding-inferno-4181.firebaseio.com/');

    // private methods

    // public methods 
    module.save = function(path, val) {
        module.db.child(path).set(val);
    },

    module.change = function(path, func) {
        module.db.child(path).transaction(func);
    }       

    return module;
} ());