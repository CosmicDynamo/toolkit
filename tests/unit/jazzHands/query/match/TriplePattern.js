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
    "jazzHands/query/match/TriplePattern",
    "jazzHands/query/DataRow",
    "RdfJs/Node",
    "jazzHands/query/Variable",
    "jazzHands/test/api/query/DataSet",
    "RdfJs/test/fake/Graph",

//Polyfill
    "polyfill/has!Array.find"
], function (TestPackage, TriplePattern, DataRow, Node, Variable, testDataSetApi, Graph) {
    return new TestPackage({
        module: "jazzHands/query/match/TriplePattern",
        tests: [
            {
                name: "run: Select all rows in graph with 3 vars not in DataRow",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s2"),
                        predicate: new Variable("?p2"),
                        object: new Variable("?o2")
                    });
                    test.expected = [
                        test.genExpectedRow("<Subject>", "<Predicate>", "<Object>"),      //0 0 0
                        test.genExpectedRow("<Subject>", "<Predicate>", "\"Object\")"),   //0 0 1
                        test.genExpectedRow("<Subject>", "<urn:predicate>", "<Object>"),  //0 1 0
                        test.genExpectedRow("<Subject>", "<urn:predicate>", "\"Object\""),//0 1 1
                        test.genExpectedRow("_:Subject", "<Predicate>", "<Object>"),      //1 0 0
                        test.genExpectedRow("_:Subject", "<Predicate>", "\"Object\""),    //1 0 1
                        test.genExpectedRow("_:Subject", "<urn:predicate>", "<Object>"),  //1 1 0
                        test.genExpectedRow("_:Subject", "<urn:predicate>", "\"Object\"") //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(8, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            (exp.s2 === s ? s.toNT() : s) &&
                            (exp.s2 === p ? p.toNT() : p) &&
                            (exp.s2 === o ? o.toNT() : o));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Select 1 row in DataRow: All vars in pattern",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s"),
                        predicate: new Variable("?p"),
                        object: new Variable("?o")
                    });
                    test.expected = [
                        test.genExpectedRow(null, null, null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(1, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : s) &&
                            exp.s2 === (p ? p.toNT() : p) &&
                            exp.s2 === (o ? o.toNT() : o));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Select 1 row in graph: All RDF Nodes in Pattern",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Node("_:Subject"),
                        predicate: new Node("<urn:predicate>"),
                        object: new Node("\"Object\"")
                    });
                    test.expected = [
                        test.genExpectedRow(null, null, null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(1, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : s) &&
                            exp.s2 === (p ? p.toNT() : p) &&
                            exp.s2 === (o ? o.toNT() : o));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Subject from DateRow: Rest from Graph",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s"),
                        predicate: new Variable("?p2"),
                        object: new Variable("?o2")
                    });
                    test.expected = [
                        test.genExpectedRow(null, "<Predicate>", "<Object>"),      //1 0 0
                        test.genExpectedRow(null, "<Predicate>", "\"Object\""),    //1 0 1
                        test.genExpectedRow(null, "<urn:predicate>", "<Object>"),  //1 1 0
                        test.genExpectedRow(null, "<urn:predicate>", "\"Object\"") //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(4, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Predicate from DateRow: Rest from Graph",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s2"),
                        predicate: new Variable("?p"),
                        object: new Variable("?o2")
                    });
                    test.expected = [
                        test.genExpectedRow("<Subject>", null, "<Object>"),  //0 1 0
                        test.genExpectedRow("<Subject>", null, "\"Object\""),//0 1 1
                        test.genExpectedRow("_:Subject", null, "<Object>"),  //1 1 0
                        test.genExpectedRow("_:Subject", null, "\"Object\"") //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(4, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Object from DateRow: Rest from Graph",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s2"),
                        predicate: new Variable("?p2"),
                        object: new Variable("?o")
                    });
                    test.expected = [
                        test.genExpectedRow("<Subject>", "<Predicate>", null),   //0 0 1
                        test.genExpectedRow("<Subject>", "<urn:predicate>", null),//0 1 1
                        test.genExpectedRow("_:Subject", "<Predicate>", null),    //1 0 1
                        test.genExpectedRow("_:Subject", "<urn:predicate>", null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(4, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Subject from Graph: Rest from DataRow",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s2"),
                        predicate: new Variable("?p"),
                        object: new Variable("?o")
                    });
                    test.expected = [
                        test.genExpectedRow("<Subject>", null, null),//0 1 1
                        test.genExpectedRow("_:Subject", null, null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(2, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Predicate from Graph: Rest from DataRow",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s"),
                        predicate: new Variable("?p2"),
                        object: new Variable("?o")
                    });
                    test.expected = [
                        test.genExpectedRow(null, "<Predicate>", null),    //1 0 1
                        test.genExpectedRow(null, "<urn:predicate>", null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(2, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Object from Graph: Rest from DataRow",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s"),
                        predicate: new Variable("?p"),
                        object: new Variable("?o2")
                    });
                    test.expected = [
                        test.genExpectedRow(null, null, "<Object>"),  //1 1 0
                        test.genExpectedRow(null, null, "\"Object\"") //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(2, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Subject from Graph: Rest from TriplePattern",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Variable("?s2"),
                        predicate: new Node("<urn:predicate>"),
                        object: new Node("\"Object\"")
                    });
                    test.expected = [
                        test.genExpectedRow("<Subject>", null, null),//0 1 1
                        test.genExpectedRow("_:Subject", null, null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(2, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Predicate from Graph: Rest from TriplePattern",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Node("_:Subject"),
                        predicate: new Variable("?p2"),
                        object: new Node("\"Object\"")
                    });
                    test.expected = [
                        test.genExpectedRow(null, "<Predicate>", null),    //1 0 1
                        test.genExpectedRow(null, "<urn:predicate>", null) //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(2, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            },
            {
                name: "run: Object from Graph: Rest from TriplePattern",
                setUp: function (test) {
                    test.pattern = new TriplePattern({
                        subject: new Node("_:Subject"),
                        predicate: new Node("<urn:predicate>"),
                        object: new Variable("?o2")
                    });
                    test.expected = [
                        test.genExpectedRow(null, null, "<Object>"),  //1 1 0
                        test.genExpectedRow(null, null, "\"Object\"") //1 1 1
                    ];
                },
                exec: function (test) {
                    var result = test.pattern.run(test.dataRow, {graph: test.graph});

                    testDataSetApi(result, test);

                    test.assertEqual(2, result.length);
                    result.forEach(function (dataRow) {
                        var found = test.expected.find(function (exp) {
                            var s = dataRow.get("s2");
                            var p = dataRow.get("p2");
                            var o = dataRow.get("o2");

                            return !!(!exp.found &&
                            exp.s === dataRow.get("s").toNT() &&
                            exp.p === dataRow.get("p").toNT() &&
                            exp.o === dataRow.get("o").toNT() &&
                            exp.s2 === (s ? s.toNT() : null) &&
                            exp.p2 === (p ? p.toNT() : null) &&
                            exp.o2 === (o ? o.toNT() : null));
                        });
                        test.assertIsObject(found, "Expected Result was in output");
                        found.found = true;
                    });

                    test.assertTrue(test.expected.every(function (exp) {
                        return exp.found;
                    }), "All Expected results were found");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            var row = new DataRow();
            row.set("s", new Node("_:Subject"));
            row.set("p", new Node("<urn:predicate>"));
            row.set("o", new Node('"Object"'));

            test.dataRow = row;

            var graph = new Graph({test: test});
            graph.__addTriple("<Subject>", "<Predicate>", "<Object>"); //0 0 0
            graph.__addTriple("<Subject>", "<Predicate>", '"Object"'); //0 0 1
            graph.__addTriple("<Subject>", "<urn:predicate>", "<Object>"); //0 1 0
            graph.__addTriple("<Subject>", "<urn:predicate>", '"Object"'); //0 1 1
            graph.__addTriple("_:Subject", "<Predicate>", "<Object>"); //1 0 0
            graph.__addTriple("_:Subject", "<Predicate>", '"Object"'); //1 0 1
            graph.__addTriple("_:Subject", "<urn:predicate>", "<Object>"); //1 1 0
            graph.__addTriple("_:Subject", "<urn:predicate>", '"Object"'); //1 1 1

            test.graph = graph;

            test.genExpectedRow = function (s2, p2, o2) {
                return {
                    s: "_:Subject",
                    p: "<urn:predicate>",
                    o: "\"Object\"",
                    s2: s2,
                    p2: p2,
                    o2: o2,
                    found: false
                };
            }
        },
        tearDown: function (test) {
        }
    });
});