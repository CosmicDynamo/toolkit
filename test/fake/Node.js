/**
 * Created by Akeron on 3/22/14.
 */
define([
    "RdfJs/test/api/Node",
    "RdfJs/Node"
], function (testApi, RealNode) {
    var Node = function (val) {
        //TODO: Add param validation
        return RealNode(val);
    };

    Node.testApi = testApi;

    return Node;
});