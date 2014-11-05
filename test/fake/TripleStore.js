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
 * @module RdfJs.test.fake.TripleStore
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "qasht/_Fake",
    "RdfJs/TripleStore",
    "RdfJs/test/api/Triple",
    "RdfJs/test/api/_TripleFilter",
    "RdfJs/test/api/_TripleCallback"
], function (declare, lang, _Fake, TripleStore, testTripleApi, testFilterApi, testCallbackApi) {
    /**
     * @class RdfJs.test.fake.TripleStore
     * @mixes qasht._Fake
     * @mixes dojo.declare
     * @mixes RdfJs.TripleStore
     */
    return declare([_Fake, TripleStore], {
        constructor: function (args) {
            var test = this.test;

            args = args || {};
            if (args.GraphCtor) {
                test.assertIsFunction(args.GraphCtor, "GraphCtor must be a function");
            }
            if (args.default) {
                test.assertIsString(args.default, "default must be a String");
            }
        },
        addGraph: function (name) {
            var test = this.test;
            test.assertEqual(1, arguments.length, "TripleStore.addGraph: only takes one argument");
            test.assertIsString(name, "TripleStore.addGraph: name must be a String");

            return this.inherited(arguments);
        },
        runOnGraphs: function (method, graphs, create) {
            var test = this.test;
            var ct = arguments.length;
            test.assertTrue(ct > 0 && ct < 4, "TripleStore.runOnGraphs: takes one - three argument");

            graphs = graphs || "DEFAULT";
            if (!lang.isArray(graphs)) {
                graphs = [graphs];
            }

            test.assertIsFunction(method, "TripleStore.runOnGraphs: method MUST be a Function");
            graphs.forEach(function (graph) {
                test.assertIsString(graph, "TripleStore.runOnGraphs: graph MUST be a String | String[]");
            });
            if (create !== undefined) {
                test.assertTrue(create === true || create === false, "TripleStore.runOnGraphs: Optional create MUST be a Boolean");
            }
            return this.inherited(arguments);
        },
        setDefault: function (value) {
            var test = this.test;
            test.assertEqual(1, arguments.length, "TripleStore.setDefault: takes one argument");
            if (!lang.isArray(value)) {
                value = [value];
            }
            value.forEach(function (graph) {
                test.assertIsString(graph, "TripleStore.setDefault: value MUST be a String | String[]");
            });
            return this.inherited(arguments);
        },
        add: function (triple, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.add: takes two arguments");
            testTripleApi(triple, test);

            return this.inherited(arguments);
        },
        addAll: function (graph, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.addAll: takes two arguments");

            test.assertIsFunction(graph.forEach, "TripleStore.addAll: graph must have a forEach method");
            return this.inherited(arguments);
        },
        remove: function (triple, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.remove: takes two arguments");
            testTripleApi(triple, test);

            return this.inherited(arguments);
        },
        removeMatches: function (subject, predicate, object, graphName) {
            var test = this.test;
            var ct = arguments.length;
            test.assertTrue(ct > 2 && ct < 5, "TripleStore.runOnGraphs: takes three or four argument");
            if (subject) {
                test.assertIsString(subject, "TripleStore.removeMatches: subject MUST be a String");
            }
            if (predicate) {
                test.assertIsString(predicate, "TripleStore.removeMatches: predicate MUST be a String");
            }
            if (object) {
                test.assertIsString(object, "TripleStore.removeMatches: object MUST be a String");
            }


            return this.inherited(arguments);
        },
        toArray: function (graphName) {
            var test = this.test;
            test.assertEqual(1, arguments.length, "TripleStore.remove: takes one arguments");

            return this.inherited(arguments);
        },
        some: function (tFilter, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.some: takes two arguments");
            testFilterApi(triple, test);

            return this.inherited(arguments);
        },
        every: function (tFilter, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.every: takes two arguments");
            testFilterApi(triple, test);

            return this.inherited(arguments);
        },
        filter: function (tFilter, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.filter: takes two arguments");
            testFilterApi(triple, test);

            return this.inherited(arguments);
        },
        forEach: function (tCallback, graphName) {
            var test = this.test;
            test.assertEqual(2, arguments.length, "TripleStore.forEach: takes two arguments");
            testCallbackApi(triple, test);

            return this.inherited(arguments);
        },
        match: function (subject, predicate, object, graphName) {
            var test = this.test;
            var ct = arguments.length;
            test.assertTrue(ct > 2 && ct < 5, "TripleStore.match: takes three or four argument");
            if (subject) {
                test.assertIsString(subject, "TripleStore.match: subject MUST be a String");
            }
            if (predicate) {
                test.assertIsString(predicate, "TripleStore.match: predicate MUST be a String");
            }
            if (object) {
                test.assertIsString(object, "TripleStore.match: object MUST be a String");
            }


            return this.inherited(arguments);
        },
        getGraph: function (name) {
            var test = this.test;

            test.assertIsString(name, "TripleStore.getGraph: name MUST be a String");

            return this.inherited(arguments);
        }
    });
});