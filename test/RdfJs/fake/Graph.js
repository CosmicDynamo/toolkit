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
    "dojo/_base/declare",
    "qasht/_Fake",
    "RdfJs/Graph",
    "RdfJs/test/fake/Triple"
], function (declare, _Fake, Graph, Triple) {
    /**
     * @class RdfJs.test.fake.Graph
     * @mixes qasht._Fake
     * @mixes RdfJs.Graph
     * @mixes dojo._base.declare
     */
    var fakeGraph = declare([_Fake, Graph], {
        add: function (triple) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            Triple.testApi(triple, test);

            return this.inherited(arguments);
        },
        remove: function (triple) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            Triple.testApi(triple, test);

            return this.inherited(arguments);
        },
        removeMatches: function (s, p, o) {
            var test = this.test;
            test.assertEqual(3, arguments.length);
            if (s !== null) {
                test.assertIsString(s, "subject");
            }
            if (p !== null) {
                test.assertIsString(p, "predicate");
            }
            if (o !== null) {
                test.assertIsString(o, "object");
            }

            return this.inherited(arguments);
        },
        toArray: function () {
            var test = this.test;
            test.assertEqual(0, arguments.length);

            return this.inherited(arguments);
        },
        some: function (tFilter) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            test.assertIsFunction(tFilter);

            return this.inherited(arguments);
        },
        every: function (tFilter) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            test.assertIsFunction(tFilter);

            return this.inherited(arguments);
        },
        filter: function (tFilter) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            test.assertIsFunction(tFilter);

            return this.inherited(arguments);
        },
        forEach: function (tCallback) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            test.assertIsFunction(tCallback);

            return this.inherited(arguments);
        },
        match: function (subject, predicate, object, limit) {
            var test = this.test;
            test.assertTrue(arguments.length === 3 || arguments.length === 4, "There are between 3 and 4 arguments");
            if (subject !== null) {
                test.assertIsString(subject, "subject");
            }
            if (predicate !== null) {
                test.assertIsString(predicate, "predicate");
            }
            if (object !== null) {
                test.assertIsString(object, "object");
            }
            if (limit !== undefined) {
                test.assertIsNumber(limit, "limit is a number");
                test.assertTrue(limit !== 0, "Limit is not 0");
            }

            return this.inherited(arguments);
        },
        merge: function (graph) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            fakeGraph.testApi(graph, test);

            return this.inherited(arguments);
        },
        addAll: function (graph) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            fakeGraph.testApi(graph, test);

            return this.inherited(arguments);
        },
        onChange: function () {
            var test = this.test;
            test.assertEqual(0, arguments.length);

            return this.inherited(arguments);
        },
        addAction: function (tAction, run) {
            var test = this.test;
            test.assertTrue(arguments.length === 1 || arguments.length === 2, "There are between 1 and 2 arguments");
            test.assertIsFunction(tAction);
            if (run !== undefined) {
                test.assertTrue(run === true || run === false, "Run is a Boolean");
            }

            return this.inherited(arguments);
        },
        equals: function (graph) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            fakeGraph.testApi(graph, test);

            return this.inherited(arguments);
        },
        clone: function () {
            var test = this.test;
            test.assertEqual(0, arguments.length);

            return this.inherited(arguments);
        },
        has: function (triple) {
            var test = this.test;
            test.assertEqual(1, arguments.length);
            Triple.testApi(triple, test);

            return this.inherited(arguments);
        },
        __addTriple: function(s, p, o){
            this.add(new Triple(s, p, o, this.test));
        }
    });

    fakeGraph.testApi = function (object, test) {
        test.assertIsObject(object);

        test.assertIsObject(object.spo);
        test.assertIsNumber(object.length);
        test.assertIsArray(object.actions);
        object.actions.forEach(function (action) {
            test.assertIsFunction(action);
        });

        test.assertIsFunction(object.TripleCtr);
        test.assertIsFunction(object.add);
        test.assertIsFunction(object.remove);
        test.assertIsFunction(object.removeMatches);
        test.assertIsFunction(object.toArray);
        test.assertIsFunction(object.some);
        test.assertIsFunction(object.every);
        test.assertIsFunction(object.filter);
        test.assertIsFunction(object.forEach);
        test.assertIsFunction(object.match);
        test.assertIsFunction(object.merge);
        test.assertIsFunction(object.addAll);
        test.assertIsFunction(object.onChange);
        test.assertIsFunction(object.addAction);
        test.assertIsFunction(object.equals);
        test.assertIsFunction(object.clone);
        test.assertIsFunction(object.has);
    };

    return fakeGraph
});