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
 * @module jazzHands.test.unit.query.Graph
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/Graph",
    "RdfJs/test/fake/TripleStore",
    "RdfJs/test/fake/Triple"
], function (TestPackage, QueryGraph, TripleStore, Triple) {
    return new TestPackage({
        module: "jazzHands/Graph",
        tests: [
            {
                name: "add: Adds Triple to a Graph",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    test.tStore.add = function (triple, graph) {
                        test.added = triple;
                        test.addGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.add(test.triple);

                    test.assertEqual(test.triple, test.added, "Triple was added to the store");
                    test.assertEqual(test.qGraph.target, test.addGraph, "Triple was added to the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "remove: Removes Triple from a Graph",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    test.tStore.remove = function (triple, graph) {
                        test.added = triple;
                        test.removeGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.remove(test.triple);

                    test.assertEqual(test.triple, test.added, "Triple was removed to the store");
                    test.assertEqual(test.qGraph.target, test.removeGraph, "Triple was removed to the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "removeMatches(): removes all triples from target Graph",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    test.tStore.removeMatches = function (subject, predicate, object, graph) {
                        test.subject = subject;
                        test.predicate = predicate;
                        test.object = object;
                        test.removeMatchesGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.removeMatches(test.triple.subject.toNT(), test.triple.predicate.toNT(), test.triple.object.toNT());

                    test.assertEqual(test.triple.subject.toNT(), test.subject, "Triple was removed to the store");
                    test.assertEqual(test.triple.predicate.toNT(), test.predicate, "Triple was removed to the store");
                    test.assertEqual(test.triple.object.toNT(), test.object, "Triple was removed to the store");
                    test.assertEqual(test.qGraph.target, test.removeMatchesGraph, "Triple was removed to the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "toArray: Returns an array containing Triples from each Graphs",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    test.tStore.toArray = function (graph) {
                        test.toArrayGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.toArray();

                    test.assertEqual(test.qGraph.target, test.toArrayGraph, "Triple was removed to the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "some: Runs fn and returns against each Graph",
                setUp: function (test) {
                    test.tFilter = { test: function () {
                        return true
                    }};
                    test.tStore.some = function (tFilter, graph) {
                        test.filterBy = tFilter;
                        test.someGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.some(test.tFilter);

                    test.assertEqual(test.tFilter, test.filterBy, "Correct Filter object was run on target Graph(s)");
                    test.assertEqual(test.qGraph.target, test.someGraph, "Some was called on the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "every: Runs fn and returns against each Graph",
                setUp: function (test) {
                    test.tFilter = { test: function () {
                        return true
                    }};
                    test.tStore.every = function (tFilter, graph) {
                        test.filterBy = tFilter;
                        test.everyGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.every(test.tFilter);

                    test.assertEqual(test.tFilter, test.filterBy, "Correct Filter object was run on target Graph(s)");
                    test.assertEqual(test.qGraph.target, test.everyGraph, "Some was called on the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "filter: Returns filter result merged from each Graph",
                setUp: function (test) {
                    test.tFilter = { test: function () {
                        return true
                    }};
                    test.tStore.filter = function (tFilter, graph) {
                        test.filterBy = tFilter;
                        test.filterGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.filter(test.tFilter);

                    test.assertEqual(test.tFilter, test.filterBy, "Correct Filter object was run on target Graph(s)");
                    test.assertEqual(test.qGraph.target, test.filterGraph, "filter  was called on the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "forEach: Runs fn on each Graph",
                setUp: function (test) {
                    test.tCallback = { test: function () {
                        return true
                    }};
                    test.tStore.forEach = function (tCallback, graph) {
                        test.callBack = tCallback;
                        test.forEachGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.forEach(test.tFilter);

                    test.assertEqual(test.tFilter, test.callBack, "Correct Callback object was run on target Graph(s)");
                    test.assertEqual(test.qGraph.target, test.forEachGraph, "forEach was called on the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "match: Returns matched results merged from each Graph",
                setUp: function (test) {
                    test.triple = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"', test);
                    test.tStore.match = function (subject, predicate, object, graph) {
                        test.subject = subject;
                        test.predicate = predicate;
                        test.object = object;
                        test.matchGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.match(test.triple.subject.toNT(), test.triple.predicate.toNT(), test.triple.object.toNT());

                    test.assertEqual(test.triple.subject.toNT(), test.subject, "Subject was passed to target Graph(s)");
                    test.assertEqual(test.triple.predicate.toNT(), test.predicate, "Predicate was passed to target Graph(s)");
                    test.assertEqual(test.triple.object.toNT(), test.object, "Object was passed to target Graph(s)e");
                    test.assertEqual(test.qGraph.target, test.matchGraph, "Triple was removed to the target Graph(s)");

                    test.complete();
                }
            },
            {
                name: "addAll: Adds Triples to each Graph",
                setUp: function (test) {
                    test.graphLikeObject = { "thisIs": "aGraph"};
                    test.tStore.addAll = function (source, graph) {
                        test.source = source;
                        test.addAllGraph = graph;
                    };
                },
                exec: function (test) {
                    test.qGraph.addAll(test.graphLikeObject);

                    test.assertEqual(test.source, test.graphLikeObject, "Source Graph was added to target Graph(s)");
                    test.assertEqual(test.qGraph.target, test.addAllGraph, "addAll was called on the target Graph(s)");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.tStore = new TripleStore(test);
            test.qGraph = new QueryGraph({
                tripleStore: test.tStore
            });
            test.qGraph.target = ["urn:TestGraph", "urn:Another"];
        },
        tearDown: function (test) {
        }
    });
});