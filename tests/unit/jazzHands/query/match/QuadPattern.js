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
 * @module jazzHands.test.unit.query.match.QuadPattern
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/match/QuadPattern",
    "jazzHands/query/DataRow",
    "RdfJs/Node",
    "jazzHands/query/Variable"
], function (TestPackage, QuadPattern, DataRow, Node, Variable) {
    return new TestPackage({
        module: "jazzHands/query/match/QuadPattern",
        tests: [
            {
                name: "match: will return matches from the DataRow for any Variable Node parts",
                setUp: function (test) {
                    test.pattern = new QuadPattern({
                        subject: new Variable("?s"),
                        predicate: new Variable("?p"),
                        object: new Variable("?o"),
                        graph: new Variable("?g")
                    })
                },
                exec: function (test) {
                    var result = test.pattern.match(test.dataRow);

                    test.assertEqual(test.dataRow.get("s"), result.subject);
                    test.assertEqual(test.dataRow.get("p"), result.predicate);
                    test.assertEqual(test.dataRow.get("o"), result.object);
                    test.assertEqual(test.dataRow.get("g"), result.graph);

                    test.complete();
                }
            },
            {
                name: "match: will return RDF value for any RDF Node parts",
                setUp: function (test) {
                    test.pattern = new QuadPattern({
                        subject: new Node("<urn:Subject>"),
                        predicate: new Node("<urn:hasPredicate>"),
                        object: new Node("<urn:object>"),
                        graph: new Node("<urn:default>")
                    })
                },
                exec: function (test) {
                    var result = test.pattern.match(test.dataRow);

                    test.assertEqual(test.pattern.subject, result.subject);
                    test.assertEqual(test.pattern.predicate, result.predicate);
                    test.assertEqual(test.pattern.object, result.object);
                    test.assertEqual(test.pattern.graph, result.graph);

                    test.complete();
                }
            },
            {
                name: "match: will return null for any Variable Node parts which are not in DataRow",
                setUp: function (test) {
                    test.pattern = new QuadPattern({
                        subject: new Variable("?s1"),
                        predicate: new Variable("?p1"),
                        object: new Variable("?o1"),
                        graph: new Variable("?g1")
                    })
                },
                exec: function (test) {
                    var result = test.pattern.match(test.dataRow);

                    test.assertNull(result.subject);
                    test.assertNull(result.predicate);
                    test.assertNull(result.object);
                    test.assertNull(result.graph);

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            var row = new DataRow();
            row.set("s", new Node("_:Subject"));
            row.set("p", new Node("<urn:predicate>"));
            row.set("o", new Node('"Object"'));
            row.set("g", new Node("<urn:graph>"));

            test.dataRow = row;
        },
        tearDown: function (test) {
        }
    });
});