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
 * @module jazzHands.parser.turtle.collection
 */
define([
    "blocks/promise/when",
    "blocks/parser/block"
], function (when, block) {
    /**
     * [15] collection ::= '(' object* ')'
     * @see http://www.w3.org/TR/turtle/#grammar-production-collection
     * @property {jazzHands.parser.Data} data
     * @return {RdfJs.node.Named | Null}
     */
    function collection(data) {
        return when(block(data, '(', ')', 0, -1, "jazzHands/parser/turtle/object"), function (list) {
            if (!list) {
                return null;
            }
            return require(["RdfJs/node/Blank", "RdfJs/Triple", "jazzHands/parser/RdfType"], function (BlankNode, Triple, RdfType) {
                var rdfFirst = RdfType("first");
                var rdfRest = RdfType("rest");

                var subject = BlankNode();
                var rest = RdfType("nil");
                list.reverse().forEach(function (object) {
                    data.graph.addAll([
                        new Triple(subject, rdfFirst, object),
                        new Triple(subject, rdfRest, rest)
                    ]);
                    rest = subject;
                    subject = BlankNode();
                });
                return rest;
            });
        });
    }

    return collection;
});