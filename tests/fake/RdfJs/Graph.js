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
 * @module RdfJs.test.fake.Graph
 */
define([
    "intern/chai!assert",
    "dojo/_base/declare",
    "RdfJs/Graph",
    "fake/RdfJs/Triple",
    "api/RdfJs/Graph"
], function (assert, declare, Graph, Triple, testApi) {
    /**
     * @class RdfJs.test.fake.Graph
     * @mixes qasht._Fake
     * @mixes RdfJs.Graph
     * @mixes dojo._base.declare
     */
    var fakeGraph = declare([Graph], {
        add: function (triple) {
            assert.strictEqual(arguments.length, 1, "Graph.add requires one parameter");
            Triple.testApi(triple, "Graph.add, 1st param MUST be a triple");

            return this.inherited(arguments);
        },
        remove: function (triple) {
            assert.strictEqual(arguments.length, 1, "Graph.remove requires one parameter");
            Triple.testApi(triple, "Graph.remove 1st parameter MUST be a triple");

            return this.inherited(arguments);
        },
        removeMatches: function (s, p, o) {
            assert.strictEqual(3, arguments.length, "Graph.removeMatches requires three parameters");
            if (s !== null) {
                assert.isString(s, "Graph.removeMatches - subject MUST be a string");
            }
            if (p !== null) {
                assert.isString(p, "Graph.removeMatches - predicate MUST be a string");
            }
            if (o !== null) {
                assert.isString(o, "Graph.removeMatches - object MUST be a string");
            }

            return this.inherited(arguments);
        },
        toArray: function () {
            assert.strictEqual(arguments.length, 0, "Graph.toArray does not take any parameters");

            return this.inherited(arguments);
        },
        some: function (tFilter) {
            assert.strictEqual(arguments.length, 1, "Graph.some requires 1 parameter");
            assert.isFunction(tFilter, "Graph.some parameter MUST be a function");

            return this.inherited(arguments);
        },
        every: function (tFilter) {
            assert.strictEqual(arguments.length, 1, "Graph.every takes one parameter");
            assert.isFunction(tFilter, "Graph.every parameter MUST be a function");

            return this.inherited(arguments);
        },
        filter: function (tFilter) {
            assert.strictEqual(arguments.length, 1, "Graph.filter takes one parameter");
            assert.isFunction(tFilter, "Graph.filter parameter MUST be a function");

            return this.inherited(arguments);
        },
        forEach: function (tCallback) {
            assert.strictEqual(arguments.length, 1, "Graph.forEach takes one parameter");
            assert.isFunction(tCallback, "Graph.forEach parameter MUST be a function");

            return this.inherited(arguments);
        },
        match: function (subject, predicate, object, limit) {
            assert.isTrue(arguments.length === 3 || arguments.length === 4, "Graphy.match takes between 3 and 4 arguments");
            if (subject !== null) {
                assert.isString(subject, "Graph.match - subject MUST be a string or NULL");
            }
            if (predicate !== null) {
                assert.isString(predicate, "Graph.match - predicate MUST be a string or NULL");
            }
            if (object !== null) {
                assert.isString(object, "Graph.match - object MUST be a string or NULL");
            }
            if (limit !== undefined) {
                assert.isNumber(limit, "limit is a number");
                assert.notEqual(limit, 0, "Limit is not 0");
            }

            return this.inherited(arguments);
        },
        merge: function (graph) {
            assert.strictEqual(arguments.length, 1, "Graph.merge takes one argument");
            testApi(graph);

            return this.inherited(arguments);
        },
        addAll: function (graph) {
            assert.strictEqual(arguments.length, 1, "Graph.addAll takes one argument");
            testApi(graph);

            return this.inherited(arguments);
        },
        onChange: function () {
            assert.strictEqual(arguments.length, 0, "Graph.onChage does not take any arguments");

            return this.inherited(arguments);
        },
        addAction: function () {
            assert.fail("Graph.addAction is deprecated");
        },
        equals: function (graph) {
            assert.strictEqual(arguments.length, 1, "Graph.equals takes one argument");
            testApi(graph);

            return this.inherited(arguments);
        },
        clone: function () {
            assert.strictEqual(arguments.length, 0, "Graph.clone does not take any arguments");

            return this.inherited(arguments);
        },
        has: function (triple) {
            assert.strictEqual(arguments.length, 1, "Graph.has takes one argument");
            Triple.testApi(triple);

            return this.inherited(arguments);
        },
        __addTriple: function(s, p, o){
            this.add(new Triple(s, p, o));
        }
    });

    fakeGraph.testApi = testApi;

    return fakeGraph
});