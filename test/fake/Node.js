/**
 * Created by Akeron on 3/22/14.
 */
define([
    "RdfJs/Node"
], function (RealNode) {
    return function (val) {
        //TODO: Add param validation
        return RealNode(val);
    };
});