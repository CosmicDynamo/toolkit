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
 * @module jazzHands.test.unit.parser.sparql.graph.optional
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/sparql/graph/optional",
    "jazzHands/parser/Data"
], function (TestPackage, optional, Data) {
    return new TestPackage({
        module: "jazzHands/parser/sparql/graph/optional",
        tests: [
            {
                name: "Return null if OPTIONAL key word not present",
                input: "{ ?s ?p ?o }",
                exec: function(test){
                    var out = optional(test.data);

                    test.assertNull(out);

                    test.complete();
                }
            },
            {
                name: "Exception thrown 'OPTIONAL' without valid GroupGraphPattern",
                input: "OPTIONAL ?s ?p ?o",
                exec: function(test){
                    try {
                        var out = optional(test.data);

                        test.whenRejected(out, function(err){
                            test.assertIsObject(err, "Promise rejected with error");

                            test.complete();
                        });
                    } catch (err){
                        test.assertIsObject(err, "Exception was thrown");

                        test.complete();
                    }
                }
            },
            {
                name: "SPARQL Optional created when valid syntax found",
                input: "OPTIONAL { ?s ?p ?o }",
                exec: function(test){
                    var out = optional(test.data);

                    testApi(out, test);

                    test.complete();
                }
            }
        ],
        setUp: function(test){
            test.data = new Data({
                input: test.input
            });
        }

    });
});