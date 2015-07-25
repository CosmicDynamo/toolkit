/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Cosmic Dynamo LLC
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
 * @module RdfJs.Node
 */
define([
    "blocks/parser/Data",
    "./parser/iriRef",
    "./parser/rdfLiteral",
    "./parser/bNode"
], function (Data, iriRef, rdfLiteral, bNode) {
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

        return iriRef(data) || rdfLiteral(data) || bNode(data);
    }

    return Node;
});