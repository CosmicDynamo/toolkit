/**
 * Created by Akeron on 2/26/14.
 */
define([
    "dojo/_base/lang",
    "blocks/parser/Data",
    "./parser/iriRef",
    "./parser/rdfLiteral",
    "./parser/bNode"
], function (lang, Data, iriRef, literal, bNode) {
    /**
     * Creates an RDF Node based on the input string
     * @param {String} value - value to be parsed
     * @param {Object} [options] - param to considered when parsing the string
     * @param {RdfJs.PrefixMap} [options.prefixMap] - a map to used when expanding any prefixed terms in the string
     * @return {*}
     * @constructor
     */
    function Node(value, options) {
        var data = new Data({
            input: value,
            prefixMap: options ? options.prefixMap : null
        });

        return iriRef(data) || literal(data) || bNode(data);
    }

    return Node;
});