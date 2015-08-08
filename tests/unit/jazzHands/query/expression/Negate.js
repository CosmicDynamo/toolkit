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
 * @module jazzHands.test.unit.query.expression.expression.Negate
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/expression/Negate",
    "RdfJs/test/fake/Node"
], function (TestPackage, Negate, Node) {
    return new TestPackage({
        module: "jazzHands/query/expression/Negate",
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

                    test.dataRow.value = input01;
                    test.assertEqual(input01, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input02;
                    test.assertEqual(input02, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input03;
                    test.assertEqual(input03, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input04;
                    test.assertEqual(input04, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input05;
                    test.assertEqual(input05, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input06;
                    test.assertEqual(input06, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input07;
                    test.assertEqual(input07, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input08;
                    test.assertEqual(input08, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input09;
                    test.assertEqual(input09, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input10;
                    test.assertEqual(input10, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input11;
                    test.assertEqual(input11, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input12;
                    test.assertEqual(input12, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input13;
                    test.assertEqual(input13, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input14;
                    test.assertEqual(input14, test.expr.resolve(test.dataRow));

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

                    test.dataRow.value = input01;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input02;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input03;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input04;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input05;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input06;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input07;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input08;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input09;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input10;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input11;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input12;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input13;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));
                    test.dataRow.value = input14;
                    test.assertTrue(isNaN(test.expr.resolve(test.dataRow)));

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

                    test.dataRow.value = input1;
                    test.assertEqual(expected1, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input2;
                    test.assertEqual(expected2, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input3;
                    test.assertEqual(expected3, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input4;
                    test.assertEqual(expected4, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input5;
                    test.assertEqual(expected5, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input6;
                    test.assertEqual(expected6, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input7;
                    test.assertEqual(expected7, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input8;
                    test.assertEqual(expected8, test.expr.resolve(test.dataRow));

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

                    test.dataRow.value = input01;
                    test.assertEqual(expected01, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input02;
                    test.assertEqual(expected02, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input03;
                    test.assertEqual(expected03, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input04;
                    test.assertEqual(expected04, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input05;
                    test.assertEqual(expected05, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input07;
                    test.assertEqual(expected07, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input09;
                    test.assertEqual(expected09, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input10;
                    test.assertEqual(expected10, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input11;
                    test.assertEqual(expected11, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input12;
                    test.assertEqual(expected12, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input13;
                    test.assertEqual(expected13, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input14;
                    test.assertEqual(expected14, test.expr.resolve(test.dataRow));

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

                    test.dataRow.value = input01;
                    test.assertEqual(expected01, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input02;
                    test.assertEqual(expected02, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input03;
                    test.assertEqual(expected03, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input04;
                    test.assertEqual(expected04, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input05;
                    test.assertEqual(expected05, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input06;
                    test.assertEqual(expected06, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input07;
                    test.assertEqual(expected07, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input08;
                    test.assertEqual(expected08, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input09;
                    test.assertEqual(expected09, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input10;
                    test.assertEqual(expected10, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input11;
                    test.assertEqual(expected11, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input12;
                    test.assertEqual(expected12, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input13;
                    test.assertEqual(expected13, test.expr.resolve(test.dataRow));
                    test.dataRow.value = input14;
                    test.assertEqual(expected14, test.expr.resolve(test.dataRow));

                    test.complete();
                }
            }
        ],
        setUp: function(test){
            test.dataRow = {
                "value":test.return
            };
            test.expr = new Negate({
                expression: {
                    resolve: function(obj){
                        test.assertEqual(test.dataRow, obj);
                        return obj.value;
                    }
                }
            })
        }
    });
});