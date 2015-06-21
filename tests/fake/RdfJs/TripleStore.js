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
    "intern/chai!assert",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "RdfJs/TripleStore",
    "api/RdfJs/Triple"
], function (assert, declare, lang, TripleStore, testTripleApi) {
    /**
     * @class RdfJs.test.fake.TripleStore
     * @mixes qasht._Fake
     * @mixes dojo.declare
     * @mixes RdfJs.TripleStore
     */
    return declare([TripleStore], {
        constructor: function (args) {
            args = args || {};
            if (args.GraphCtor) {
                assert.isFunction(args.GraphCtor, "GraphCtor must be a function");
            }
            if (args.default) {
                assert.isString(args.default, "default must be a String");
            }
        },
        addGraph: function (name) {
            assert.strictEqual(arguments.length, 1, "TripleStore.addGraph: only takes one argument");
            assert.isString(name, "TripleStore.addGraph: name must be a String");

            return this.inherited(arguments);
        },
        runOnGraphs: function (method, graphs, create) {
            var ct = arguments.length;
            assert.isTrue(ct > 0 && ct < 4, "TripleStore.runOnGraphs: takes one - three argument");

            graphs = graphs || "DEFAULT";
            if (!lang.isArray(graphs)) {
                graphs = [graphs];
            }

            assert.isFunction(method, "TripleStore.runOnGraphs: method MUST be a Function");
            graphs.forEach(function (graph) {
                assert.isString(graph, "TripleStore.runOnGraphs: graph MUST be a String | String[]");
            });
            if (create !== undefined) {
                assert.isTrue(create === true || create === false, "TripleStore.runOnGraphs: Optional create MUST be a Boolean");
            }
            return this.inherited(arguments);
        },
        setDefault: function (value) {
            assert.stricttEqual(arguments.length, 1,"TripleStore.setDefault: takes one argument");
            if (!lang.isArray(value)) {
                value = [value];
            }
            value.forEach(function (graph) {
                assert.isString(graph, "TripleStore.setDefault: value MUST be a String | String[]");
            });
            return this.inherited(arguments);
        },
        add: function (triple, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.add: takes two arguments");
            testTripleApi(triple);

            return this.inherited(arguments);
        },
        addAll: function (graph, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.addAll: takes two arguments");

            assert.isFunction(graph.forEach, "TripleStore.addAll: graph must have a forEach method");
            return this.inherited(arguments);
        },
        remove: function (triple, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.remove: takes two arguments");
            testTripleApi(triple);

            return this.inherited(arguments);
        },
        removeMatches: function (subject, predicate, object, graphName) {
            var ct = arguments.length;
            assert.isTrue(ct > 2 && ct < 5, "TripleStore.runOnGraphs: takes three or four argument");
            if (subject) {
                assert.isString(subject, "TripleStore.removeMatches: subject MUST be a String");
            }
            if (predicate) {
                assert.isString(predicate, "TripleStore.removeMatches: predicate MUST be a String");
            }
            if (object) {
                assert.isString(object, "TripleStore.removeMatches: object MUST be a String");
            }


            return this.inherited(arguments);
        },
        toArray: function (graphName) {
            assert.strictEqual(arguments.length, 1, "TripleStore.remove: takes one arguments");

            return this.inherited(arguments);
        },
        some: function (tFilter, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.some: takes two arguments");
            assert.isFunction(tFilter);

            return this.inherited(arguments);
        },
        every: function (tFilter, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.every: takes two arguments");
            assert.isFunction(tFilter);

            return this.inherited(arguments);
        },
        filter: function (tFilter, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.filter: takes two arguments");
            assert.isFunction(tFilter);

            return this.inherited(arguments);
        },
        forEach: function (tCallback, graphName) {
            assert.strictEqual(arguments.length, 2, "TripleStore.forEach: takes two arguments");
            assert.isFunction(tCallback);

            return this.inherited(arguments);
        },
        match: function (subject, predicate, object, graphName) {
            var ct = arguments.length;
            assert.isTrue(ct > 2 && ct < 5, "TripleStore.match: takes three or four argument");
            if (subject) {
                assert.isString(subject, "TripleStore.match: subject MUST be a String");
            }
            if (predicate) {
                assert.isString(predicate, "TripleStore.match: predicate MUST be a String");
            }
            if (object) {
                assert.isString(object, "TripleStore.match: object MUST be a String");
            }


            return this.inherited(arguments);
        },
        getGraph: function (name) {
            assert.isString(name, "TripleStore.getGraph: name MUST be a String");

            return this.inherited(arguments);
        }
    });
});