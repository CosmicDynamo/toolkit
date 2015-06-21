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
 * @module tests.unit.RdfJs.Triple
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/Triple",
    "fake/RdfJs/Node"
], function (intern, assert, Triple, Node) {
    return new intern({
        name: "RdfJs/Triple",
        "equals: Returns true if input = self": function(){
            var list = [], list2 = [];
            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 5; oIdx++) {
                        list.push(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: '"' + oIdx + '"^^<xsd:int>',
                            Node: Node
                        }));
                        list2.push(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: '"' + oIdx + '"^^<xsd:int>',
                            Node: Node
                        }));
                    }
                }
            }

            for (var idx = 0; idx < list.length; idx++) {
                assert.isTrue(list[idx].equals(list2[idx]));
            }
        },
        "equals: Returns false if input != self": function(){
            var list = [], list2 = [];
            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 5; oIdx++) {
                        list.push(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: '"' + oIdx + '"^^<xsd:int>',
                            Node: Node
                        }));
                        list2.push(new Triple({
                            subject: "_:" + sIdx + 1,
                            predicate: p[pIdx],
                            object: '"' + oIdx + '"^^<xsd:int>',
                            Node: Node
                        }));
                    }
                }
            }

            for (var idx = 0; idx < list.length; idx++) {
                assert.isFalse(list[idx].equals(list2[idx]));
            }
        },
        "toString: Outputs a string in N-Triples notation": function(){
            var list = [];
            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 5; oIdx++) {
                        list.push(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: '"' + oIdx + '"^^<xsd:int>',
                            Node: Node
                        }));
                    }
                }
            }

            for (var idx = 0; idx < list.length; idx++) {
                var t = list[idx];
                var nt = t.subject.toNT() + " " + t.predicate.toNT() + " " + t.object.toNT() + " .";
                assert.strictEqual(t.toString(), nt);
            }
        }
    });
});