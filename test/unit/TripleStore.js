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
 * @module RdfJs.test.unit.TripleStore
 */
define([
    "qasht/package/Unit",
    "RdfJs/TripleStore",
    "RdfJs/test/fake/Graph",
    "RdfJs/test/fake/Triple",
    "RdfJs/test/api/TripleStore"
], function (TestPackage, TripleStore, Graph, Triple, testStoreApi) {
    return new TestPackage({
        module: "RdfJs/TripleStore",
        tests: [
            {
                name: "API",
                exec: function (test) {
                    testStoreApi(test.tStore, test);

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: Runs input function with the requested Graph",
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    }, "urn:FirstGraph");

                    test.assertTrue(test.graphs[0].run, "Graph 1 was hit");
                    test.assertUndefined(test.graphs[1].run, "Graph 2 was NOT hit");
                    test.assertUndefined(test.graphs[2].run, "DEFAULT was NOT hit");

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: Runs input function with the requested Graphs",
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    }, ["urn:FirstGraph", "urn:SecondGraph"]);

                    test.assertTrue(test.graphs[0].run, "Graph 1 was hit");
                    test.assertTrue(test.graphs[1].run, "Graph 2 was hit");
                    test.assertUndefined(test.graphs[2].run, "DEFAULT was NOT hit");

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: Runs input function for the DEFAULT Graph",
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    }, "DEFAULT");

                    test.assertUndefined(test.graphs[0].run, "Graph 1 was NOT hit");
                    test.assertUndefined(test.graphs[1].run, "Graph 2 was NOT hit");
                    test.assertTrue(test.graphs[2].run, "DEFAULT was hit");

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: With no target specified Runs input function for the DEFAULT Graph",
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    });

                    test.assertUndefined(test.graphs[0].run, "Graph 1 was NOT hit");
                    test.assertUndefined(test.graphs[1].run, "Graph 2 was NOT hit");
                    test.assertTrue(test.graphs[2].run, "DEFAULT was hit");

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: Runs input function for the DEFAULT Graphs",
                setUp: function () {
                    this.tStore.setDefault(["urn:SecondGraph", "urn:FirstGraph"]);
                },
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    });

                    test.assertTrue(test.graphs[0].run, "Graph 1 was hit");
                    test.assertTrue(test.graphs[1].run, "Graph 2 was hit");
                    test.assertUndefined(test.graphs[2].run, "DEFAULT was NOT hit");

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: Runs input function for the DEFAULT=ALL Graphs",
                setUp: function () {
                    this.tStore.setDefault("ALL");
                },
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    });

                    test.assertTrue(test.graphs[0].run, "Graph 1 was hit");
                    test.assertTrue(test.graphs[1].run, "Graph 2 was hit");
                    test.assertTrue(test.graphs[2].run, "DEFAULT was hit");

                    test.complete();
                }
            },
            {
                name: "runOnGraphs: Runs input function for ALL Graphs",
                exec: function (test) {
                    test.tStore.runOnGraphs(function (graph) {
                        graph.run = true;
                    }, "ALL");

                    test.assertTrue(test.graphs[0].run, "Graph 1 was hit");
                    test.assertTrue(test.graphs[1].run, "Graph 2 was hit");
                    test.assertTrue(test.graphs[2].run, "DEFAULT was hit");

                    test.complete();
                }
            },
            {
                name: "add: Adds Triple to the target Graph",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    var graph = test.tStore.getGraph("urn:FirstGraph");
                    graph.add = function (Triple) {
                        test.addedTriple = Triple;
                    };
                },
                exec: function (test) {
                    test.tStore.add(test.triple, "urn:FirstGraph");

                    test.assertEqual("urn:FirstGraph", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(test.triple, test.addedTriple, "Triple Added to First Graph");

                    test.complete();
                }
            },
            {
                name: "remove: Removes Triple from a Graph",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    var graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.remove = function (Triple) {
                        test.removedTriple = Triple;
                    };
                },
                exec: function (test) {
                    test.tStore.remove(test.triple);

                    test.assertEqual("DEFAULT", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(test.triple, test.removedTriple, "Triple Removed from Third Graph");

                    test.complete();
                }
            },
            {
                name: "removeMatches(): removes all triples from target Graph",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.removeMatches = function (v1, v2, v3) {
                        test.match1 = v1;
                        test.match2 = v2;
                        test.match3 = v3;
                    };
                },
                exec: function (test) {
                    var p1 = { name: "param1"};
                    var p2 = { name: "param2"};
                    var p3 = { name: "param3"};
                    test.tStore.removeMatches(p1, p2, p3);

                    test.assertEqual("DEFAULT", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(p1, test.match1, "Subject was passed as Subject to Graph#removeMatches");
                    test.assertEqual(p2, test.match2, "Predicate was passed as Predicate to Graph#removeMatches");
                    test.assertEqual(p3, test.match3, "Object was passed as Object to Graph#removeMatches");

                    test.complete();
                }
            },
            {
                name: "toArray: Returns an array containing Triples from target Graph(s)",
                setUp: function (test) {
                    var string = "Graph1 Graph2 AndMore Really? Graph3";
                    var values = string.split(" ");
                    var graph = test.tStore.getGraph("urn:FirstGraph");
                    graph.toArray = function () {
                        return values.splice(0, 1);
                    };
                    graph = test.tStore.getGraph("urn:SecondGraph");
                    graph.toArray = function () {
                        return values.splice(0, 2);
                    };
                    graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.toArray = function () {
                        return values;
                    };

                    test.string = string;
                },
                exec: function (test) {
                    var array = test.tStore.toArray("ALL");

                    test.assertEqual("ALL", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(5, array.length);
                    var result = test.string;
                    array.forEach(function (value) {
                        result = result.replace(value, "found");
                    });

                    test.assertEqual("found found found found found", result);

                    test.complete();
                }
            },
            {
                name: "some: Runs fn and returns against target Graph",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.some = function () {
                        return false;
                    };
                    graph = test.tStore.getGraph("urn:SecondGraph");
                    graph.some = function () {
                        return false;
                    };
                    graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.some = function () {
                        return test.result;
                    };
                },
                exec: function (test) {
                    var tFilter = {
                        test: function () {
                            return true;
                        }
                    };
                    test.result = true;
                    test.assertTrue(test.tStore.some(tFilter, "ALL"), "Returns true when a Graph returns true");
                    test.assertEqual("ALL", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.result = false;
                    test.assertFalse(test.tStore.some(tFilter, "ALL"), "Returns false when no Graphs returns true");

                    test.complete();
                }
            },
            {
                name: "every: Runs fn and returns against target Graph",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.every = function () {
                        return true;
                    };
                    graph = test.tStore.getGraph("urn:SecondGraph");
                    graph.every = function () {
                        return true;
                    };
                    graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.every = function () {
                        return test.result;
                    };
                },
                exec: function (test) {
                    var tFilter = {
                        test: function () {
                            return true;
                        }
                    };
                    test.result = true;
                    test.assertTrue(test.tStore.every(tFilter, "ALL"), "Returns true when a Graph returns true");
                    test.assertEqual("ALL", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");

                    test.result = false;
                    test.assertFalse(test.tStore.every(tFilter, "ALL"), "Returns false when no Graphs returns true");

                    test.complete();
                }
            },
            {
                name: "filter: Returns filter result merged from traget Graph(s)",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:FirstGraph");
                    graph.filter = function () {
                        var g = new Graph({test: test});
                        g.add(new Triple({subject: "<urn:FirstGraph>", predicate: "<urn:hasValue>", object: '"G1"'}, test));
                        return g;
                    };
                    graph = test.tStore.getGraph("urn:SecondGraph");
                    graph.filter = function () {
                        var g = new Graph({test: test});
                        g.add(new Triple({subject: "<urn:SecondGraph>", predicate: "<urn:hasValue>", object: '"G2"'}, test));
                        return g;
                    };
                    graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.filter = function () {
                        var g = new Graph({test: test});
                        g.add(new Triple({subject: "<urn:ThirdGraph>", predicate: "<urn:hasValue>", object: '"G3"'}, test));
                        return g;
                    };
                },
                exec: function (test) {
                    var tFilter = {
                        test: function () {
                            return true;
                        }
                    };
                    var result = test.tStore.filter(tFilter, "ALL");

                    Graph.testApi(result, test);
                    test.assertEqual("ALL", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(3, result.length);

                    test.assertEqual(1, result.match("<urn:FirstGraph>", "<urn:hasValue>", '"G1"').length, "First Value Found");
                    test.assertEqual(1, result.match("<urn:SecondGraph>", "<urn:hasValue>", '"G2"').length, "Second Value Found");
                    test.assertEqual(1, result.match("<urn:ThirdGraph>", "<urn:hasValue>", '"G3"').length, "Third Value Found");

                    test.complete();
                }
            },
            {
                name: "forEach: Runs fn on target Graph",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.forEach = function (callback) {
                        callback.run("Triple");
                    };

                    test.runOnGraphsCalled = null;
                },
                exec: function (test) {
                    var tCallback = {
                        run: function (arg) {
                            test.assertEqual("Triple", arg);
                            test.run = true;
                        }
                    };

                    test.tStore.forEach(tCallback);

                    test.assertEqual("DEFAULT", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertTrue(test.run, "Callback called");

                    test.complete();
                }
            },
            {
                name: "match: Returns matched results merged from target Graph",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:FirstGraph");
                    graph.match = function (v1, v2, v3) {
                        test.match1 = v1;
                        test.match2 = v2;
                        test.match3 = v3;
                        var g = new Graph({test: test});
                        g.add(new Triple({subject: "<urn:FirstGraph>", predicate: "<urn:hasValue>", object: '"G1"'}, test));
                        return g;
                    };
                    graph = test.tStore.getGraph("urn:SecondGraph");
                    graph.match = function () {
                        var g = new Graph({test: test});
                        g.add(new Triple({subject: "<urn:SecondGraph>", predicate: "<urn:hasValue>", object: '"G2"'}, test));
                        return g;
                    };
                    graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.match = function () {
                        var g = new Graph({test: test});
                        g.add(new Triple({subject: "<urn:ThirdGraph>", predicate: "<urn:hasValue>", object: '"G3"'}, test));
                        return g;
                    };
                },
                exec: function (test) {
                    var p1 = { name: "param1"};
                    var p2 = { name: "param2"};
                    var p3 = { name: "param3"};
                    var result = test.tStore.match(p1, p2, p3, "ALL");

                    test.assertEqual("ALL", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(p1, test.match1, "Subject was passed as Subject to Graph#removeMatches");
                    test.assertEqual(p2, test.match2, "Predicate was passed as Predicate to Graph#removeMatches");
                    test.assertEqual(p3, test.match3, "Object was passed as Object to Graph#removeMatches");

                    test.assertEqual(1, result.match("<urn:FirstGraph>", "<urn:hasValue>", '"G1"').length, "First Value Found");
                    test.assertEqual(1, result.match("<urn:SecondGraph>", "<urn:hasValue>", '"G2"').length, "Second Value Found");
                    test.assertEqual(1, result.match("<urn:ThirdGraph>", "<urn:hasValue>", '"G3"').length, "Third Value Found");

                    test.complete();
                }
            },
            {
                name: "addAll: Adds Triples to target Graph",
                setUp: function (test) {
                    var graph = test.tStore.getGraph("urn:ThirdGraph");
                    graph.addAll = function (list) {
                        test.added = list;
                    };
                },
                exec: function (test) {
                    var p1 = new Graph({test: test});
                    p1.add(new Triple({subject: "<urn:ThirdGraph>", predicate: "<urn:hasValue>", object: '"G3"'}, test));
                    test.tStore.addAll(p1);

                    test.assertEqual("DEFAULT", test.runOnGraphsCalled, "runOnGraphs method was used to execute this request");
                    test.assertEqual(p1, test.added, "input Graph was passed to target Graph#addAll");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.tStore = new TripleStore({
                GraphCtor: function (args) {
                    args = args || {};
                    args.test = test;
                    return Graph(args);
                },
                default: "urn:ThirdGraph"
            });

            test.graphs = [];
            test.graphs.push(test.tStore.addGraph("urn:FirstGraph"));
            test.graphs.push(test.tStore.addGraph("urn:SecondGraph"));
            test.graphs.push(test.tStore.addGraph("urn:ThirdGraph"));

            //Create A hook to test that this method was called as part of the execution of other methods
            var fn = test.tStore.runOnGraphs;
            test.tStore.runOnGraphs = function (method, graph) {
                if (!test.runOnGraphsCalled) {
                    test.runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };
        }
    });
});