/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * @module RdfJs.node._Node
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
