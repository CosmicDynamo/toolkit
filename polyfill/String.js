/**
 * Created by Akeron on 3/23/14.
 */
var polyfill = [];
if (!String.prototype.codePointAt) {
    polyfill.push("jazzHands/polyfill/String/codePointAt")
}

define(polyfill, function () {

});