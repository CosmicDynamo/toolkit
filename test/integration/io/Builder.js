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
 * @module class.test.unit.io.Builder
 */
define([
    "qasht/package/Unit",
    "service/io/Builder"
], function (TestPackage, Builder) {
    return new TestPackage({
        module: "service/io/Builder",
        type: "Integration",
        tests: [
            {
                name: "exception: returns a new Builder with new Subject",
                exec: function (test) {
                    var out = test.builder.exception(0);

                    test.assertEqual("<0>", out.subject);
                    test.assertEqual(test.builder.graphName, out.graphName);

                    test.complete();
                }
            },
            {
                name: "exception: Triple added to graph of type Exception",
                exec: function (test) {
                    var out = test.builder.exception(0);

                    var data = test.builder.store.getGraph(test.builder.graphName);
                    test.assertEqual(1, data.length, "Only one Triple Added");
                    test.assertEqual(1, data.match(out.subject, "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", "<http://cosmicdynamo.net/vocab/exception.owl#Exception>").length, "Added Triple is the desired one");

                    test.complete();
                }
            },
            {
                name: "addObject: returns a new Builder with the desired Subject",
                exec: function (test) {
                    var out = test.builder.addObject("urn:Root");

                    test.assertEqual("<urn:Root>", out.subject);
                    test.assertEqual(test.builder.graphName, out.graphName);

                    test.complete();
                }
            },
            {
                name: "addType: Type Triple added with the input type",
                exec: function (test) {
                    var out = test.builder.addType("urn:TestType");

                    var data = test.builder.store.getGraph(test.builder.graphName);
                    test.assertEqual(1, data.length, "Only one Triple Added");
                    test.assertEqual(1, data.match(out.subject, "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", "<urn:TestType>").length, "Added Triple is a Type triple");

                    test.complete();
                }
            },
            {
                name: "setValue: Triple with predicate and value is added",
                exec: function (test) {
                    var out = test.builder.setValue("<urn:hasValue>", "'value'");

                    var data = test.builder.store.getGraph(test.builder.graphName);
                    test.assertEqual(1, data.length, "Only one Triple Added");
                    test.assertEqual(1, data.match(out.subject, "<urn:hasValue>", "\"value\"").length, "Added Triple is a Type triple");

                    test.complete();
                }
            },
            {
                name: "setValue: Replaces old value",
                exec: function (test) {
                    var out = test.builder.setValue("<urn:hasValue>", "'originalValue'");

                    var data = test.builder.store.getGraph(test.builder.graphName);
                    test.assertEqual(1, data.length, "Only one Triple Added");

                    test.builder.setValue("<urn:hasValue>", "'newValue'");
                    test.assertEqual(1, data.length, "Only one Triple Exists");
                    test.assertEqual(1, data.match(out.subject, "<urn:hasValue>", "\"newValue\"").length, "Added Triple is a Type triple");

                    test.complete();
                }
            },
            {
                name: "addTriple: Triple with predicate and value is added",
                exec: function (test) {
                    var out = test.builder.setValue("<urn:hasValue>", "'value'");

                    var data = test.builder.store.getGraph(test.builder.graphName);
                    test.assertEqual(1, data.length, "Only one Triple Added");
                    test.assertEqual(1, data.match(out.subject, "<urn:hasValue>", "\"value\"").length, "Added Triple is a Type triple");

                    test.complete();
                }
            },
            {
                name: "removeValue: Removes any values for hte input predicate",
                exec: function (test) {
                    var out = test.builder.setValue("<urn:hasValue>", "'value'")
                        .setValue("<urn:hasField2>", "'value'");

                    var data = test.builder.store.getGraph(test.builder.graphName);
                    test.assertEqual(2, data.length, "Only one Triple Added");

                    out.removeValue("<urn:hasValue>");
                    test.assertEqual(1, data.length, "Triple was removed");
                    test.assertEqual(0, data.match(out.subject, "<urn:hasValue>", null).length, "Added Triple is a Type triple");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.builder = new Builder({ subject: "<urn:TestData>" });
        },
        tearDown: function (test) {
        }
    });
});