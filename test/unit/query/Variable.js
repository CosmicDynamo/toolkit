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
 * @module jazzHands.test.unit.query.Variable
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/Variable",
    "RdfJs/test/fake/Node"
], function (TestPackage, Variable, Node) {
    return new TestPackage({
        module: "jazzHands/Variable",
        tests: [
            {
                name: "toString: Returns the original form of this variable",
                exec: function (test) {
                    var v1 = new Variable("?var1");
                    var v2 = new Variable("$var2");

                    test.assertEqual("?var1", v1.toString(), "Variable 1 toString returns ?var1");
                    test.assertEqual("$var2", v2.toString(), "Variable 2 toString returns $var2");

                    test.complete();
                }
            },
            {
                name: "toNT: returns null",
                exec: function (test) {
                    var v1 = new Variable("?var1");
                    var v2 = new Variable("$var2");

                    test.assertTrue(v1.toNT() === null, "Variable 1 toNT returns NULL");
                    test.assertTrue(v2.toNT() === null, "Variable 2 toNT returns NULL");

                    test.complete();
                }
            },
            {
                name: "resolve: reads input data row for desired value",
                setUp: function (test) {
                    test.row = {
                        iri: new Node("<urn:Value>", test),
                        bNode: new Node("_:b1", test),
                        literal: new Node('"Hello World"', test)
                    }
                },
                exec: function (test) {
                    var iri = new Variable("?iri");
                    var bNode = new Variable("?bNode");
                    var literal = new Variable("?literal");

                    test.assertEqual(test.row.iri, iri.resolve(test.row));
                    test.assertEqual(test.row.bNode, bNode.resolve(test.row));
                    test.assertEqual(test.row.literal, literal.resolve(test.row));

                    test.complete();
                }
            }
        ]
    });
});