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
 * @module tests.integration.jazzHands.parser.turtle
 */
define([
    "../w3cTestRunner",
    "intern/chai!assert",
    "jazzHands/parser/turtle",
    "blocks/promise/all",
    "RdfJs/Triple",
    "tests/unit/RdfJs/graph/compare",
    "fake/RdfJs/Graph",
    "blocks/promise/when"
], function (w3cTestRunner, assert, turtle, all, Triple, compare, Graph, when) {
    var loadResults = function (file) {
        var out = new Graph();
        var lines = file.split("\n");
        for (var ln = 0; ln < lines.length; ln++) {
            if (lines[ln].length > 0) {

                var columns = lines[ln].split(" ");

                if (columns.length >= 3) {
                    out.add(new Triple({
                        subject: columns[0],
                        predicate: columns[1],
                        object: columns.slice(2, columns.length - 1).join(" ")
                    }));
                }
            }
        }

        return out;
    };

    var setUp = function(iri, graph, options, testFn){
        var testData = {};
        var loadAction = graph.match(iri.toNT(), "<" + w3cTestRunner.prefixMap.resolve("mf:action") + ">", null).toArray().map(function(action){
            var name = action.object.valueOf();
            return options.getFile(name, function(text){
                testData.base = "http://www.w3.org/2013/TurtleTests" + name.substr(name.lastIndexOf("/"));
                testData.data = text;

            });
        });

        var loadResult = graph.match(iri.toNT(), "<" +  w3cTestRunner.prefixMap.resolve("mf:result") + ">",  null).toArray().map(function(action){
            var name = action.object.valueOf();
            return options.getFile(name, function(text){
                testData.expected = loadResults(text);

            });
        });

        return when(all(loadAction.concat(loadResult)), function(){
            try {
                testFn(testData);
            } catch (ex) {
                assert.fail(ex);
            }
        });
    };

    var testResults = function(testData){
        try {
            return when(turtle(testData.data, {base: testData.base}), function (actual) {
                Graph.testApi(actual);
                try {
                    var result = compare(testData.expected || new Graph(), actual);
                } catch (err) {
                    assert.fail(null, null, err.message);
                }
                assert.isTrue(result, "Test result does not match expected");
            }, assert.fail);
        } catch (err) {
            assert.fail(err);
        }
    };

    var positive = function (test) {
        try {
            return when(turtle(test.data, {base: test.base}), function (results) {
                Graph.testApi(results);
            }, assert.fail);
        } catch (err) {
            assert.fail(err);
        }
    };

    var negative = function (test) {
        try {
            return when(turtle(test.data, {base: test.base}), function(){
                assert.fail({message: "Parsing should have failed"});
            }, function (err) {
                assert.isObject(err, "Error was thrown");
            });
        } catch (err) {
            assert.isObject(err, "Error was thrown");
        }
    };

    w3cTestRunner("tests/integration/jazzHands/parser/turtle/manifest.ttl", {
        name: "jazzHands/parser/turtle",
        debugId: {
            //"tests/integration/jazzHands/parser/turtle/manifest.ttl#turtle-syntax-uri-01":true
        },
        default: function(iri, graph, options){
            var done = this.async();
            var ready = setUp(iri, graph, options, testResults);

            when(ready, done.resolve);
        },
        "http://www.w3.org/ns/rdftest#TestTurtleNegativeSyntax": function (iri, graph, options) {
            var done = this.async();
            var ready = setUp(iri, graph, options, negative);

            when(ready, done.resolve);
        },
        "http://www.w3.org/ns/rdftest#TestTurtleNegativeEval": function (iri, graph, options) {
            var done = this.async();
            var ready = setUp(iri, graph, options, negative);

            when(ready, done.resolve);
        },
        "http://www.w3.org/ns/rdftest#TestTurtlePositiveSyntax": function (iri, graph, options) {
            var done = this.async();
            var ready = setUp(iri, graph, options, positive);

            when(ready, done.resolve);
        }
    });
});