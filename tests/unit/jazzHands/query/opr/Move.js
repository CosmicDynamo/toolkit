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
 * @module jazzHands.test.unit.query.opr.Move
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/opr/Move",
    "RdfJs/TripleStore",
    "jazzHands/query/Graph",
    "RdfJs/Triple"
], function (TestPackage, Move, TripleStore, qGraph, Triple) {
    return new TestPackage({
        module: "jazzHands/query/opr/Move",
        tests: [
            {
                name: "execute: Source Graph is Removed",
                exec: function (test) {
                    test.operation.execute();

                    test.assertNull(test.store.getGraph("source"), "Graph has been removed");

                    test.complete();
                }
            },
            {
                name: "execute: Destination Graph contains source's values",
                exec: function (test) {
                    test.operation.execute();

                    var graph = test.store.getGraph("destination");
                    test.assertEqual(1, graph.length, "destination contains 1 property");
                    test.assertEqual(1, graph.match("<urn:Subject>", "<urn:predicate>", '"object"').length, "Record matches value from source graph");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.store = new TripleStore();
            test.operation = new Move({
                store: test.store,
                source: new qGraph({
                    tripleStore: test.store,
                    target: ["source"]
                }),
                destination: new qGraph({
                    tripleStore: test.store,
                    target: ["destination"]
                })
            });

            var graph = test.store.addGraph("source");
            graph.add(new Triple({
                subject: "<urn:Subject>",
                predicate: "<urn:predicate>",
                object: "'object'"
            }));
        }
    });
});