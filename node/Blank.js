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
 * @module RdfJs.node.Blank
 */
define([
    "./_Node",
    "blocks/genId"
], function (_Node, genId) {
    /**
     * @class RdfJs.node.Blank
     * @see http://www.w3.org/TR/rdf-interfaces/#idl-def-BlankNode
     */
    return function (params) {
        var bNode = new _Node(params);
        bNode.interfaceName = "BlankNode";
        bNode.type = 'blank node';
        bNode.toString = function () {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString */
            return "_:" + this.nominalValue;
        };

        var v = bNode.nominalValue || genId();
        if (v.indexOf("_:") === 0) {
            v = v.substr(2);
        }
        bNode.nominalValue = v;

        /* JSON-LD support */
        bNode.value = bNode.toString();

        return bNode;
    };
});