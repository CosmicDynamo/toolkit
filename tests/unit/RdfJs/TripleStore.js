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
 * @module tests.unit.RdfJs.TripleStore
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/TripleStore",
    "fake/RdfJs/Graph",
    "fake/RdfJs/Triple",
    "api/RdfJs/TripleStore"
], function (intern, assert, TripleStore, Graph, Triple, testStoreApi) {
    var store, first, second, third;
    return new intern({
        name: "RdfJs/TripleStore",
        "API": function() {
            testStoreApi(store);
        },
        "runOnGraphs: Runs input function with the requested Graph": function() {
            store.runOnGraphs(function (graph) {
                graph.run = true;
            }, "urn:FirstGraph");

            assert.isTrue(first.run, "Graph 1 was hit");
            assert.isUndefined(second.run, "Graph 2 was NOT hit");
            assert.isUndefined(third.run, "DEFAULT was NOT hit");
        },
        "runOnGraphs: Runs input function with the requested Graphs": function(){
            store.runOnGraphs(function (graph) {
                graph.run = true;
            }, ["urn:FirstGraph", "urn:SecondGraph"]);

            assert.isTrue(first.run, "Graph 1 was hit");
            assert.isTrue(second.run, "Graph 2 was hit");
            assert.isUndefined(third.run, "DEFAULT was NOT hit");
        },
        "runOnGraphs: Runs input function for the DEFAULT Graph": function(){
            store.runOnGraphs(function (graph) {
                graph.run = true;
            }, "DEFAULT");

            assert.isUndefined(first.run, "Graph 1 was NOT hit");
            assert.isUndefined(second.run, "Graph 2 was NOT hit");
            assert.isTrue(third.run, "DEFAULT was hit");
        },
        "runOnGraphs: With no target specified Runs input function for the DEFAULT Graph": function(){
            store.runOnGraphs(function (graph) {
                graph.run = true;
            });

            assert.isUndefined(first.run, "Graph 1 was NOT hit");
            assert.isUndefined(second.run, "Graph 2 was NOT hit");
            assert.isTrue(third.run, "DEFAULT was hit");
        },
        "runOnGraphs: Runs input function for the DEFAULT Graphs": function(){
            store.setDefault(["urn:SecondGraph", "urn:FirstGraph"]);

            store.runOnGraphs(function (graph) {
                graph.run = true;
            });

            assert.isTrue(first.run, "Graph 1 was hit");
            assert.isTrue(second.run, "Graph 2 was hit");
            assert.isUndefined(third.run, "DEFAULT was NOT hit");
        },
        "runOnGraphs: Runs input function for the DEFAULT=ALL Graphs": function(){
            store.setDefault("ALL");

            store.runOnGraphs(function (graph) {
                graph.run = true;
            });

            assert.isTrue(first.run, "Graph 1 was hit");
            assert.isTrue(second.run, "Graph 2 was hit");
            assert.isTrue(third.run, "DEFAULT was hit");
        },
        "runOnGraphs: Runs input function for ALL Graphs": function(){
            store.runOnGraphs(function (graph) {
                graph.run = true;
            }, "ALL");

            assert.isTrue(first.run, "Graph 1 was hit");
            assert.isTrue(second.run, "Graph 2 was hit");
            assert.isTrue(third.run, "DEFAULT was hit");
        },
        "add: Adds Triple to the target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            var expected = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"');
            var actual = null;
            first.add = function (Triple) {
                actual = Triple;
            };
            third.add = second.add = function (Triple) {
                assert.fail({message: "Triple should not be added here"})
            };

            store.add(expected, "urn:FirstGraph");

            assert.strictEqual(actual, expected, "Triple Added to First Graph");
        },
        "remove: Removes Triple from a Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            var expected = new Triple("<urn:Subject>", "<urn:PhasPredicate>", '"Object"');
            var actual = null;
            third.remove = function (Triple) {
                actual = Triple;
            };
            first.remove = second.add = function (Triple) {
                assert.fail({message: "Triple should not be removed here"})
            };

            store.remove(expected);

            assert.strictEqual(runOnGraphsCalled, "DEFAULT", "runOnGraphs method was used to execute this request");
            assert.strictEqual(actual, expected, "Triple Added to First Graph");
        },
        "removeMatches(): removes all triples from target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            var match1 = null, match2 = null, match3 = null;
            third.removeMatches = function (v1, v2, v3) {
                match1 = v1;
                match2 = v2;
                match3 = v3;
            };
            first.removeMatches = second.removeMatches = function (Triple) {
                assert.fail({message: "Triple should not be removed here"})
            };

            var p1 = { name: "param1"};
            var p2 = { name: "param2"};
            var p3 = { name: "param3"};
            store.removeMatches(p1, p2, p3);

            assert.strictEqual(runOnGraphsCalled, "DEFAULT", "runOnGraphs method was used to execute this request");
            assert.strictEqual(match1, p1, "Subject was passed as Subject to Graph#removeMatches");
            assert.strictEqual(match2, p2, "Predicate was passed as Predicate to Graph#removeMatches");
            assert.strictEqual(match3, p3, "Object was passed as Object to Graph#removeMatches");
        },
        "toArray: Returns an array containing Triples from target Graph(s)": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            var string = "Graph1 Graph2 AndMore Really? Graph3";
            var values = string.split(" ");
            first.toArray = function () {
                return values.splice(0, 1);
            };
            second.toArray = function () {
                return values.splice(0, 2);
            };
            third.toArray = function () {
                return values;
            };

            var array = store.toArray("ALL");

            assert.strictEqual(runOnGraphsCalled, "ALL", "runOnGraphs method was used to execute this request");
            assert.strictEqual(array.length, 5);
            array.forEach(function (value) {
                string = string.replace(value, "found");
            });

            assert.strictEqual(string, "found found found found found");
        },
        "some: Runs fn and returns against target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };
            var result = true;

            first.some = second.some = function () {
                return false;
            };
            third.some = function () {
                return result;
            };

            var tFilter = function () {
                return true;
            };

            assert.isTrue(store.some(tFilter, "ALL"), "Returns true when a Graph returns true");
            assert.strictEqual(runOnGraphsCalled, "ALL", "runOnGraphs method was used to execute this request");
            result = false;
            assert.isFalse(store.some(tFilter, "ALL"), "Returns false when no Graphs returns true");
        },
        "every: Runs fn and returns against target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };
            var result = true;

            first.every = second.every = function () {
                return true;
            };
            third.every = function () {
                return result;
            };

            var tFilter = function () {
                return true;
            };
            assert.isTrue(store.every(tFilter, "ALL"), "Returns true when a Graph returns true");
            assert.strictEqual(runOnGraphsCalled, "ALL", "runOnGraphs method was used to execute this request");

            result = false;
            assert.isFalse(store.every(tFilter, "ALL"), "Returns false when no Graphs returns true");
        },
        "filter: Returns filter result merged from traget Graph(s)": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            first.filter = function () {
                var g = new Graph();
                g.add(new Triple({subject: "<urn:FirstGraph>", predicate: "<urn:hasValue>", object: '"G1"'}));
                return g;
            };
            second.filter = function () {
                var g = new Graph();
                g.add(new Triple({subject: "<urn:SecondGraph>", predicate: "<urn:hasValue>", object: '"G2"'}));
                return g;
            };
            third.filter = function () {
                var g = new Graph();
                g.add(new Triple({subject: "<urn:ThirdGraph>", predicate: "<urn:hasValue>", object: '"G3"'}));
                return g;
            };

            var tFilter = function () {
                return true;
            };
            var result = store.filter(tFilter, "ALL");

            Graph.testApi(result);
            assert.strictEqual(runOnGraphsCalled, "ALL", "runOnGraphs method was used to execute this request");
            assert.strictEqual(result.length, 3);

            assert.strictEqual(result.match("<urn:FirstGraph>", "<urn:hasValue>", '"G1"').length, 1, "First Value Found");
            assert.strictEqual(result.match("<urn:SecondGraph>", "<urn:hasValue>", '"G2"').length, 1, "Second Value Found");
            assert.strictEqual(result.match("<urn:ThirdGraph>", "<urn:hasValue>", '"G3"').length, 1, "Third Value Found");
        },
        "forEach: Runs fn on target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            first.forEach = second.removeMatches = function () {
                assert.fail({message: "Triple should not be removed here"})
            };
            third.forEach = function (callback) {
                callback("Triple");
            };

            var run = null;
            var tCallback = function (arg) {
                assert.strictEqual("Triple", arg);
                run = true;
            };

            store.forEach(tCallback);

            assert.strictEqual(runOnGraphsCalled, "DEFAULT", "runOnGraphs method was used to execute this request");
            assert.isTrue(run, "Callback called");
        },
        "match: Returns matched results merged from target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            var match1 = null, match2 = null, match3 = null;
            first.match = function (v1, v2, v3) {
                match1 = v1;
                match2 = v2;
                match3 = v3;
                var g = new Graph();
                g.add(new Triple({subject: "<urn:FirstGraph>", predicate: "<urn:hasValue>", object: '"G1"'}));
                return g;
            };
            second.match = function () {
                var g = new Graph();
                g.add(new Triple({subject: "<urn:SecondGraph>", predicate: "<urn:hasValue>", object: '"G2"'}));
                return g;
            };
            third.match = function () {
                var g = new Graph();
                g.add(new Triple({subject: "<urn:ThirdGraph>", predicate: "<urn:hasValue>", object: '"G3"'}));
                return g;
            };

            var p1 = { name: "param1"};
            var p2 = { name: "param2"};
            var p3 = { name: "param3"};
            var result = store.match(p1, p2, p3, "ALL");

            assert.strictEqual(runOnGraphsCalled, "ALL", "runOnGraphs method was used to execute this request");
            assert.strictEqual(match1, p1, "Subject was passed as Subject to Graph#removeMatches");
            assert.strictEqual(match2, p2, "Predicate was passed as Predicate to Graph#removeMatches");
            assert.strictEqual(match3, p3, "Object was passed as Object to Graph#removeMatches");

            assert.strictEqual(result.match("<urn:FirstGraph>", "<urn:hasValue>", '"G1"').length, 1, "First Value Found");
            assert.strictEqual(result.match("<urn:SecondGraph>", "<urn:hasValue>", '"G2"').length, 1, "Second Value Found");
            assert.strictEqual(result.match("<urn:ThirdGraph>", "<urn:hasValue>", '"G3"').length, 1, "Third Value Found");
        },
        "addAll: Adds Triples to target Graph": function(){
            var fn = store.runOnGraphs;

            var runOnGraphsCalled = false;
            store.runOnGraphs = function (method, graph) {
                if (!runOnGraphsCalled) {
                    runOnGraphsCalled = graph || "DEFAULT";
                }
                return fn.apply(this, arguments);
            };

            var added = null;
            third.addAll = function (list) {
                added = list;
            };

            var p1 = new Graph();
            var s = "<urn:ThirdGraph>";
            var p = "<urn:hasValue>";
            var o = '"G3"';
            p1.add(new Triple({subject: s, predicate: p, object: o}));
            store.addAll(p1);

            assert.strictEqual(runOnGraphsCalled, "DEFAULT", "runOnGraphs method was used to execute this request");
            assert.strictEqual(added.length, p1.length, "input Graph was passed to target Graph#addAll");
            assert.strictEqual(added.match(s, p, o).length, 1);
        },
        beforeEach: function(){
            store = new TripleStore({
                GraphCtor: Graph,
                default: "urn:ThirdGraph"
            });

            first = store.addGraph("urn:FirstGraph");
            second = store.addGraph("urn:SecondGraph");
            third = store.addGraph("urn:ThirdGraph");
        }
    });
});