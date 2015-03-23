/**
 * Created by Akeron on 2/26/14.
 */
define([
    "dojo/_base/declare"
], function (declare) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-RDFNode> */
    /**
     * @class RdfJs.Node
     */
    return declare([], {
        /** @property {String} */
        nominalValue: null,
        /** @property {String} */
        interfaceName: null,
        constructor: function(value){
            this.nominalValue = (value && value.nominalValue) || value;
        },
        /**
         * Returns the String form of this Rdf Node
         * @see  http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString
         * @return {String}
         */
        toString: function () {
            return this.nominalValue;
        },
        /**
         * Returns the native value of this Rdf Node
         * @see  http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-valueOf-any
         * @return {*}
         */
        valueOf: function () {
            return this.nominalValue;
        },
        /**
         * Returns the NT form of this Rdf Node
         * @see  http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toNT-DOMString
         * @return {String}
         */
        toNT: function (prefixMap) {
            return this.toString(prefixMap);
        },
        /**
         * Compares this RDF Nodes to the input RDF Node or input native value
         * @param {RdfJs.Node || *} toCompare
         * @return {boolean}
         * @see http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-equals-boolean-any-tocompare
         */
        equals: function (toCompare) {
            if (toCompare.interfaceName) {
                var match = this.interfaceName === toCompare.interfaceName;
                if (toCompare.valueOf) {
                    match = match && this.valueOf() === toCompare.valueOf();
                } else {
                    match = match && this.nominalValue == toCompare.nominalValue;
                }
                return match;
            }

            return this.valueOf() === toCompare;
        },
        /* Helper method */
        isBlank: function () {
            // summary:
            //           Helper method to identify if this node is a bNode
            // returns:  (Boolean)
            //           true -> If the node is a bNode
            //           false -> else
            return this.interfaceName === "BlankNode";
        },
        isNamed: function () {
            // summary:
            //           Helper method to identify if this node is a named node
            // returns:  (Boolean)
            //           true -> If the node is a  named node
            //           false -> else
            return this.interfaceName === "NamedNode";
        },
        isLiteral: function () {
            // summary:
            //           Helper method to identify if this node is a literal node
            // returns:  (Boolean)
            //           true -> If the node is a  literal node
            //           false -> else
            return this.interfaceName === "Literal";
        }
    });
});
