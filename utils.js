var file=module.parent.exports; // This variable is used to access the variables of index.js

function removeA(arr) {		// This is a userful function to remove an element from an object
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


module.exports.removeA=removeA;		// We can just access from outside the variables declared here