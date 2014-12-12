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
 * @module jazzHands.test.unit.query.function.numeric-unary-minus
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/function/numeric-unary-minus",
    "RdfJs/test/fake/Node"
], function (TestPackage, unaryMinus, Node) {
    /* -1 * unaryPlus($arg) */
    return new TestPackage({
        module: "jazzHands/query/function/numeric-unary-minus",
        tests: [
            {
                name: "Numeric = 0 -> returned as is",
                exec: function(test){
                    var input01 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input02 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input03 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input04 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input05 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input06 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input07 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var input08 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input09 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var input10 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var input11 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var input12 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var input13 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var input14 = new Node('"0"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);

                    test.assertEqual(input01, unaryMinus(input01));
                    test.assertEqual(input02, unaryMinus(input02));
                    test.assertEqual(input03, unaryMinus(input03));
                    test.assertEqual(input04, unaryMinus(input04));
                    test.assertEqual(input05, unaryMinus(input05));
                    test.assertEqual(input06, unaryMinus(input06));
                    test.assertEqual(input07, unaryMinus(input07));
                    test.assertEqual(input08, unaryMinus(input08));
                    test.assertEqual(input09, unaryMinus(input09));
                    test.assertEqual(input10, unaryMinus(input10));
                    test.assertEqual(input11, unaryMinus(input11));
                    test.assertEqual(input12, unaryMinus(input12));
                    test.assertEqual(input13, unaryMinus(input13));
                    test.assertEqual(input14, unaryMinus(input14));

                    test.complete();
                }
            },
            {
                name: "Numeric NAN -> returned as is",
                exec: function(test){
                    var input01 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input02 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input03 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input04 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input05 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input06 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input07 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var input08 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input09 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var input10 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var input11 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var input12 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var input13 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var input14 = new Node('"NaN"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);

                    test.assertTrue(isNaN(unaryMinus(input01)));
                    test.assertTrue(isNaN(unaryMinus(input02)));
                    test.assertTrue(isNaN(unaryMinus(input03)));
                    test.assertTrue(isNaN(unaryMinus(input04)));
                    test.assertTrue(isNaN(unaryMinus(input05)));
                    test.assertTrue(isNaN(unaryMinus(input06)));
                    test.assertTrue(isNaN(unaryMinus(input07)));
                    test.assertTrue(isNaN(unaryMinus(input08)));
                    test.assertTrue(isNaN(unaryMinus(input09)));
                    test.assertTrue(isNaN(unaryMinus(input10)));
                    test.assertTrue(isNaN(unaryMinus(input11)));
                    test.assertTrue(isNaN(unaryMinus(input12)));
                    test.assertTrue(isNaN(unaryMinus(input13)));
                    test.assertTrue(isNaN(unaryMinus(input14)));

                    test.complete();
                }
            },
            {
                name: "Numeric < 0 -> returned as is",
                exec: function(test){
                    var input1 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var expected1 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input2 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var expected2 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input3 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var expected3 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input4 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var expected4 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input5 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var expected5 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input6 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var expected6 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input7 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var expected7 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input8 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var expected8 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#short>', test);

                    test.assertEqual(expected1, unaryMinus(input1));
                    test.assertEqual(expected2, unaryMinus(input2));
                    test.assertEqual(expected3, unaryMinus(input3));
                    test.assertEqual(expected4, unaryMinus(input4));
                    test.assertEqual(expected5, unaryMinus(input5));
                    test.assertEqual(expected6, unaryMinus(input6));
                    test.assertEqual(expected7, unaryMinus(input7));
                    test.assertEqual(expected8, unaryMinus(input8));

                    test.complete();
                }
            },
            {
                name: "Numeric > 0 -> returned as is",
                exec: function(test){
                    var input01 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var expected01 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input02 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var expected02 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input03 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var expected03 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input04 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var expected04 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input05 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var expected05 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input07 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var expected07 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var input09 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var expected09 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var input10 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var expected10 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var input11 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var expected11 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var input12 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var expected12 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var input13 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var expected13 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var input14 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);
                    var expected14 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);

                    test.assertEqual(expected01, unaryMinus(input01));
                    test.assertEqual(expected02, unaryMinus(input02));
                    test.assertEqual(expected03, unaryMinus(input03));
                    test.assertEqual(expected04, unaryMinus(input04));
                    test.assertEqual(expected05, unaryMinus(input05));
                    test.assertEqual(expected07, unaryMinus(input07));
                    test.assertEqual(expected09, unaryMinus(input09));
                    test.assertEqual(expected10, unaryMinus(input10));
                    test.assertEqual(expected11, unaryMinus(input11));
                    test.assertEqual(expected12, unaryMinus(input12));
                    test.assertEqual(expected13, unaryMinus(input13));
                    test.assertEqual(expected14, unaryMinus(input14));

                    test.complete();
                }
            },
            {
                name: "Numeric = INF -> returned as is",
                exec: function(test){
                    var input01 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var expected01 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input02 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var expected02 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input03 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var expected03 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input04 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var expected04 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input05 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var expected05 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input06 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var expected06 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input07 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var expected07 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var input08 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var expected08 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input09 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var expected09 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var input10 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var expected10 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var input11 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var expected11 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var input12 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var expected12 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var input13 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var expected13 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var input14 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);
                    var expected14 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);

                    test.assertEqual(expected01, unaryMinus(input01));
                    test.assertEqual(expected02, unaryMinus(input02));
                    test.assertEqual(expected03, unaryMinus(input03));
                    test.assertEqual(expected04, unaryMinus(input04));
                    test.assertEqual(expected05, unaryMinus(input05));
                    test.assertEqual(expected06, unaryMinus(input06));
                    test.assertEqual(expected07, unaryMinus(input07));
                    test.assertEqual(expected08, unaryMinus(input08));
                    test.assertEqual(expected09, unaryMinus(input09));
                    test.assertEqual(expected10, unaryMinus(input10));
                    test.assertEqual(expected11, unaryMinus(input11));
                    test.assertEqual(expected12, unaryMinus(input12));
                    test.assertEqual(expected13, unaryMinus(input13));
                    test.assertEqual(expected14, unaryMinus(input14));

                    test.complete();
                }
            }
        ]
    });
});