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
 * @module tests.unit.RdfJs.Graph
 */
define([
    "intern!object",
    "intern/chai!assert",
    "fake/RdfJs/Triple",
    "RdfJs/Graph"
], function (intern, assert, Triple, Graph) {
    return new intern({
        name: "RdfJs/Graph",
        "add(Triple): Adds the specified Triple to the graph": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"!!!\"^^<xsd:string>"});
            graph.add(input);

            var contains = graph.toArray();

            assert.isArray(contains);
            assert.strictEqual(contains.length, 1);
            assert.strictEqual(contains[0].toNT(), input.toNT());
        },
        "add(Triple): returns the graph instance it was called on": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"!!!\"^^<xsd:string>"});
            var output = graph.add(input);

            assert.strictEqual(output, graph);
        },
        "remove(Triple): Removes the specified Triple from the Graph": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-remove-Graph-Triple-triple
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"!!!\"^^<xsd:string>"});
            graph.add(input);

            var contains = graph.toArray();

            assert.strictEqual(contains.length, 1);

            graph.remove(input);

            contains = graph.toArray();

            assert.strictEqual(contains.length, 0);
        },
        "remove(Triple): returns the graph instance it was called on": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({
                subject: "<urn:Hello>",
                predicate: "<urn:World>",
                object: "\"!!!\"^^<xsd:string>"
            });
            var output = graph.remove(input);

            assert.strictEqual(output, graph);
        },
        "removeMatches(): removes all triples": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 10; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var removed = graph.removeMatches(null, null, null);
            assert.strictEqual(removed, graph);
            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(Node): removes those triples which match the given subject": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;

            for (var idx = 0; idx < 10; idx++) {
                graph.removeMatches("_:" + idx, null, null);
                assert.strictEqual(graph.length, count - (idx ? 30 : 0));
                count = graph.length;
            }

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(null, Node): removes those triples which match the given predicate": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 0; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 0; oIdx < 10; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;
            graph.removeMatches(null, "<urn:notAValue>", null);
            assert.strictEqual(graph.length, count);

            graph.removeMatches(null, "<urn:hasValue>", null);
            assert.strictEqual(graph.length, count - 100);
            count = graph.length;

            graph.removeMatches(null, "<urn:count>", null);
            assert.strictEqual(graph.length, count - 100);
            count = graph.length;

            graph.removeMatches(null, "<urn:hasPuppies>", null);
            assert.strictEqual(graph.length, count - 100);
            count = graph.length;

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(null, null, Node): removes those triples which match the given object": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;

            for (var idx = 0; idx < 11; idx++) {
                graph.removeMatches(null, null, "\"" + idx + "\"^^<xsd:int>");
                assert.strictEqual(graph.length, count - (idx ? 30 : 0));
                count = graph.length;
            }

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(Node, Node): removes those triples which match the given subject && predicate": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;
            var idx;
            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches("_:" + idx, "<urn:notAValue>", null);
                assert.strictEqual(graph.length, count);
            }

            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches("_:" + idx, "<urn:hasValue>", null);

                assert.strictEqual(graph.length, count - (idx ? 10 : 0));

                count = graph.length;
            }

            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches("_:" + idx, "<urn:count>", null);
                assert.strictEqual(graph.length, count - (idx ? 10 : 0));
                count = graph.length;
            }

            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches("_:" + idx, "<urn:hasPuppies>", null);
                assert.strictEqual(graph.length, count - (idx ? 10 : 0));
                count = graph.length;
            }

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(Node, null, Node): removes those triples which match the given subject && object": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            var oIdx;
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;

            for (var idx = 0; idx < 11; idx++) {
                for (oIdx = 0; oIdx < 11; oIdx++) {
                    graph.removeMatches("_:" + idx, null, "\"" + oIdx + "\"^^<xsd:int>");
                    assert.strictEqual(graph.length, count - ((idx && oIdx) ? 3 : 0));
                    count = graph.length;
                }
            }

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(null, Node, Node): removes those triples which match the given predicate && object": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;
            var idx;
            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches(null, "<urn:notAValue>", "\"" + idx + "\"^^<xsd:int>");
                assert.strictEqual(graph.length, count);
            }

            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches(null, "<urn:hasValue>", "\"" + idx + "\"^^<xsd:int>");
                assert.strictEqual(graph.length, count - (idx ? 10 : 0));
                count = graph.length;
            }

            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches(null, "<urn:count>", "\"" + idx + "\"^^<xsd:int>");
                assert.strictEqual(graph.length, count - (idx ? 10 : 0));
                count = graph.length;
            }

            for (idx = 0; idx < 11; idx++) {
                graph.removeMatches(null, "<urn:hasPuppies>", "\"" + idx + "\"^^<xsd:int>");
                assert.strictEqual(graph.length, count - (idx ? 10 : 0));
                count = graph.length;
            }

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(Node, Node, Node): removes those triples which match the given subject && predicate && object": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            var sIdx, idx;
            for (sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;
            for (sIdx = 0; sIdx < 11; sIdx++) {
                for (idx = 0; idx < 11; idx++) {
                    graph.removeMatches("_:" + sIdx, "<urn:notAValue>", "\"" + idx + "\"^^<xsd:int>");
                    assert.strictEqual(graph.length, count);
                }
            }

            for (sIdx = 0; sIdx < 11; sIdx++) {
                for (idx = 0; idx < 11; idx++) {
                    graph.removeMatches("_:" + sIdx, "<urn:hasValue>", "\"" + idx + "\"^^<xsd:int>");
                    assert.strictEqual(graph.length, count - (((sIdx != 0) && (idx != 0)) ? 1 : 0));
                    count = graph.length;
                }
            }

            for (sIdx = 0; sIdx < 11; sIdx++) {
                for (idx = 0; idx < 11; idx++) {
                    graph.removeMatches("_:" + sIdx, "<urn:count>", "\"" + idx + "\"^^<xsd:int>");
                    assert.strictEqual(graph.length, count - (((sIdx != 0) && (idx != 0)) ? 1 : 0));
                    count = graph.length;
                }
            }

            for (sIdx = 0; sIdx < 11; sIdx++) {
                for (idx = 0; idx < 11; idx++) {
                    graph.removeMatches("_:" + sIdx, "<urn:hasPuppies>", "\"" + idx + "\"^^<xsd:int>");
                    assert.strictEqual(graph.length, count - (((sIdx != 0) && (idx != 0)) ? 1 : 0));
                    count = graph.length;
                }
            }

            assert.strictEqual(graph.length, 0);
        },
        "removeMatches(): returns the graph instance it was called on": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"!!!\"^^<xsd:string>"});
            var output = graph.removeMatches(input);

            assert.strictEqual(output, graph);
        },
        "toArray: Returns the set of Triples within the Graph": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-toArray-sequence-Triple
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"!!!\"^^<xsd:string>"});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);

            var contains = graph.toArray();

            assert.strictEqual(contains.length, 2);
            assert.isArray(contains);
        },
        "some:  This method will return boolean true when the first Triple is found that passes the test": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-some-boolean-TripleFilter-callback
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            var input3 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"ABC\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);
            graph.add(input3);

            assert.isTrue(graph.some(function (triple) {
                return triple.object.toNT() === "\"XOXO\"^^<xsd:string>";
            }));
        },
        "some:  This method will return boolean false if no Triple is found that passes the test": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-some-boolean-TripleFilter-callback
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            var input3 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"ABC\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);
            graph.add(input3);

            assert.isFalse(graph.some(function () {
                return false;
            }));
        },
        "every:  This method will return boolean false when the first Triple is found that does not pass the test.": function(){
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            var input3 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"ABC\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);
            graph.add(input3);

            assert.isFalse(graph.every(function (triple) {
                return triple.object.toNT() !== "\"XOXO\"^^<xsd:string>";
            }));
        },
        "every:  This method will return boolean true if every Triple is found that passes the test.": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-every-boolean-TripleFilter-callback
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            var input3 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"ABC\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);
            graph.add(input3);

            assert.isTrue(graph.some(function () {
                return true;
            }));
        },
        "filter:  Creates a new Graph with all the Triples which pass the test implemented by the provided TripleFilter.": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-filter-Graph-TripleFilter-filter
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            var input3 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"ABC\"^^<xsd:string>"});
            var input4 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"Who's on First!!\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);
            graph.add(input3);
            graph.add(input4);

            var out = graph.filter(function (triple) {
                return triple.object.toNT() === "\"XOXO\"^^<xsd:string>" || triple.object.toNT() === "\"123\"";
            });

            assert.strictEqual(out.length, 2);

            var has1 = false, has2 = false;
            out.forEach(function (triple) {
                if (triple.object.toNT() == "\"123\"") {
                    has1 = true;
                }
                if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                    has2 = true;
                }
            });

            assert.isTrue(has1 && has2);
        },
        "forEach:  Executes the provided TripleCallback once on each Triple in the Graph.": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-forEach-void-TripleCallback-callback
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            var input3 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"ABC\"^^<xsd:string>"});
            var input4 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"Who's on First!!\"^^<xsd:string>"});
            graph.add(input);
            graph.add(input2);
            graph.add(input3);
            graph.add(input4);

            var obj = {
                run1: false,
                run2: false,
                run3: false,
                run4: false
            };
            graph.forEach(function (triple) {
                if (triple.object.toNT() == "\"123\"") {
                    obj.run1 = true;
                }
                if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                    obj.run2 = true;
                }
                if (triple.object.toNT() == "\"ABC\"^^<xsd:string>") {
                    obj.run3 = true;
                }
                if (triple.object.toNT() == "\"Who's on First!!\"^^<xsd:string>") {
                    obj.run4 = true;
                }
            });

            assert.isTrue(obj.run1 && obj.run2 && obj.run3 && obj.run4);
        },
        "match(): matches all triples": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 10; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var out = graph.match(null, null, null);
            assert.strictEqual(out.length, graph.length);
            assert.notEqual(graph, out);
        },
        "match(Node): matches those triples which match the given subject": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;

            for (var idx = 0; idx < 10; idx++) {
                var out = graph.match("_:" + idx, null, null);
                assert.strictEqual(out.length, idx ? 30 : 0);
                assert.notEqual(out.length, count);
            }

            assert.strictEqual(graph.length, count);
        },
        "match(null, Node): matches those triples which match the given predicate": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 0; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 0; oIdx < 10; oIdx++) {
                        graph.add(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: "\"" + oIdx + "\"^^<xsd:int>"
                        }));
                    }
                }
            }

            var count = graph.length;
            var out;
            out = graph.match(null, "<urn:notAValue>", null);
            assert.strictEqual(out.length, 0, "did not find unexpected values");

            out = graph.match(null, "<urn:hasValue>", null);
            assert.strictEqual(out.length, 100, "found the values");

            out = graph.match(null, "<urn:count>", null);
            assert.strictEqual(out.length, 100, "found the value counts");

            out = graph.match(null, "<urn:hasPuppies>", null);
            assert.strictEqual(out.length, 100, "Found the puppy owners");

            assert.strictEqual(graph.length, count, "Graph length unchanged");
        },
        "match(null, null, Node): matches those triples which match the given object": function() {
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: "\"" + oIdx + "\"^^<xsd:int>"
                        }));
                    }
                }
            }

            var count = graph.length;

            for (var idx = 0; idx < 10; idx++) {
                var out = graph.match(null, null, "\"" + idx + "\"^^<xsd:int>");
                assert.strictEqual(out.length, idx ? 30 : 0);
            }

            assert.strictEqual(graph.length, count);
        },
        "match(Node, Node): matches those triples which match the given subject && predicate": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
            var graph = new Graph({
                TripleCtr: Triple
            });

            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;
            var idx, out;
            for (idx = 0; idx < 11; idx++) {
                out = graph.match("_:" + idx, "<urn:notAValue>", null);
                assert.strictEqual(out.length, 0);
            }

            for (idx = 0; idx < 11; idx++) {
                out = graph.match("_:" + idx, "<urn:hasValue>", null);
            }

            for (idx = 0; idx < 11; idx++) {
                out = graph.match("_:" + idx, "<urn:count>", null);
            }

            for (idx = 0; idx < 11; idx++) {
                out = graph.match("_:" + idx, "<urn:hasPuppies>", null);
            }

            assert.strictEqual(graph.length, count);
        },
        "match(Node, null, Node): matches those triples which match the given subject && object": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit
            var graph = new Graph({
                TripleCtr: Triple
            });

            var oIdx, p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 11; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (oIdx = 1; oIdx < 11; oIdx++) {
                        graph.add(new Triple({subject: "_:" + sIdx, predicate: p[pIdx], object: "\"" + oIdx + "\"^^<xsd:int>"}));
                    }
                }
            }

            var count = graph.length;

            for (var idx = 0; idx < 11; idx++) {
                for (oIdx = 0; oIdx < 11; oIdx++) {
                    var out = graph.match("_:" + idx, null, "\"" + oIdx + "\"^^<xsd:int>");
                    assert.strictEqual(out.length, (idx && oIdx) ? 3 : 0);
                }
            }

            assert.strictEqual(graph.length, count);
        },
        "merge: Returns a new Graph which is a concatenation of this graph and the graph given as an argument.": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-merge-Graph-Graph-graph
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            graph.add(input);
            var g2 = new Graph({
                TripleCtr: Triple
            });
            g2.add(input2);

            var out = graph.merge(g2);

            assert.strictEqual(out.length, 2);
            var obj = {
                run1: false,
                run2: false
            };
            out.forEach(function (triple) {
                if (triple.object.toNT() == "\"123\"") {
                    obj.run1 = true;
                }
                if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                    obj.run2 = true;
                }
            });
            assert.isTrue(obj.run1 && obj.run2);
            assert.notEqual(graph, out);
            assert.notEqual(g2, out);
        },
        "addAll: Imports the graph in to this graph. This method returns the graph instance it was called on": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-addAll-Graph-Graph-graph
            var graph = new Graph({
                TripleCtr: Triple
            });

            var input = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"123\""});
            var input2 = new Triple({subject: "<urn:Hello>", predicate: "<urn:World>", object: "\"XOXO\"^^<xsd:string>"});
            graph.add(input);
            var g2 = new Graph({
                TripleCtr: Triple
            });
            g2.add(input2);

            var out = graph.merge(g2);

            assert.strictEqual(out.length, 2);
            var obj = {
                run1: false,
                run2: false
            };
            out.forEach(function (triple) {
                if (triple.object.toNT() == "\"123\"") {
                    obj.run1 = true;
                }
                if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                    obj.run2 = true;
                }
            });
            assert.isTrue(obj.run1 && obj.run2);
            assert.notEqual(graph, out);
            assert.notEqual(g2, out);
        },
        "addAction: Adds a new TripleAction to the array of actions": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-Graph-addAction-Graph-TripleAction-action-boolean-run
            var graph = new Graph({
                TripleCtr: Triple
            });

            var a1 = {
                runCt: 0
            }, a2 = {
                runCt: 0
            };

            graph.add(Triple({subject: "<1>", predicate: "<1>", object: "\"1\""}));

            graph.addAction(function () {
                a1.runCt++;
            });

            assert.strictEqual(a1.runCt, 0);
            assert.strictEqual(a2.runCt, 0);

            graph.add(Triple({subject: "<2>", predicate: "<2>", object: "\"2\""}));

            assert.strictEqual(a1.runCt, 1);
            assert.strictEqual(a2.runCt, 0);

            graph.addAction(function () {
                a2.runCt++;
            }, true);

            assert.strictEqual(a1.runCt, 1);
            assert.strictEqual(a2.runCt, 2);

            graph.add(Triple({subject: "<3>", predicate: "<3>", object: "\"3\""}));

            assert.strictEqual(a1.runCt, 2);
            assert.strictEqual(a2.runCt, 3);
        }
    })
});