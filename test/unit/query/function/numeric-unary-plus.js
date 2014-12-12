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
 * @module jazzHands.test.unit.query.function.numeric-unary-plus
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/function/numeric-unary-plus",
    "RdfJs/test/fake/Node"
], function (TestPackage, unaryPlus, Node) {
    /*
     If $arg is the empty sequence, fn:boolean returns false.
     If $arg is a sequence whose first item is a node, fn:boolean returns true.
     If $arg is a singleton value of type xs:boolean or a derived from xs:boolean, fn:boolean returns $arg.
     If $arg is a singleton value of type xs:string or a type derived from xs:string, xs:anyURI or a type derived from xs:anyURI or xs:untypedAtomic, fn:boolean returns false if the operand value has zero length; otherwise it returns true.
     If $arg is a singleton value of any numeric type or a type derived from a numeric type, fn:boolean returns false if the operand value is NaN or is numerically equal to zero; otherwise it returns true.
     In all other cases, fn:boolean raises a type error [err:FORG0006].
     */
    return new TestPackage({
        module: "jazzHands/query/function/numeric-unary-plus",
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

                    test.assertEqual(input01, unaryPlus(input01));
                    test.assertEqual(input02, unaryPlus(input02));
                    test.assertEqual(input03, unaryPlus(input03));
                    test.assertEqual(input04, unaryPlus(input04));
                    test.assertEqual(input05, unaryPlus(input05));
                    test.assertEqual(input06, unaryPlus(input06));
                    test.assertEqual(input07, unaryPlus(input07));
                    test.assertEqual(input08, unaryPlus(input08));
                    test.assertEqual(input09, unaryPlus(input09));
                    test.assertEqual(input10, unaryPlus(input10));
                    test.assertEqual(input11, unaryPlus(input11));
                    test.assertEqual(input12, unaryPlus(input12));
                    test.assertEqual(input13, unaryPlus(input13));
                    test.assertEqual(input14, unaryPlus(input14));

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

                    test.assertTrue(isNaN(unaryPlus(input01)));
                    test.assertTrue(isNaN(unaryPlus(input02)));
                    test.assertTrue(isNaN(unaryPlus(input03)));
                    test.assertTrue(isNaN(unaryPlus(input04)));
                    test.assertTrue(isNaN(unaryPlus(input05)));
                    test.assertTrue(isNaN(unaryPlus(input06)));
                    test.assertTrue(isNaN(unaryPlus(input07)));
                    test.assertTrue(isNaN(unaryPlus(input08)));
                    test.assertTrue(isNaN(unaryPlus(input09)));
                    test.assertTrue(isNaN(unaryPlus(input10)));
                    test.assertTrue(isNaN(unaryPlus(input11)));
                    test.assertTrue(isNaN(unaryPlus(input12)));
                    test.assertTrue(isNaN(unaryPlus(input13)));
                    test.assertTrue(isNaN(unaryPlus(input14)));

                    test.complete();
                }
            },
            {
                name: "Numeric < 0 -> returned as is",
                exec: function(test){
                    var input1 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input2 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input3 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input4 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input5 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input6 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input7 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input8 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#short>', test);

                    test.assertEqual(input1, unaryPlus(input1));
                    test.assertEqual(input2, unaryPlus(input2));
                    test.assertEqual(input3, unaryPlus(input3));
                    test.assertEqual(input4, unaryPlus(input4));
                    test.assertEqual(input5, unaryPlus(input5));
                    test.assertEqual(input6, unaryPlus(input6));
                    test.assertEqual(input7, unaryPlus(input7));
                    test.assertEqual(input8, unaryPlus(input8));

                    test.complete();
                }
            },
            {
                name: "Numeric > 0 -> returned as is",
                exec: function(test){
                    var input01 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input02 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input03 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input04 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input05 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input07 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var input09 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var input10 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var input11 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var input12 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var input13 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var input14 = new Node('"1"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);

                    test.assertEqual(input01, unaryPlus(input01));
                    test.assertEqual(input02, unaryPlus(input02));
                    test.assertEqual(input03, unaryPlus(input03));
                    test.assertEqual(input04, unaryPlus(input04));
                    test.assertEqual(input05, unaryPlus(input05));
                    test.assertEqual(input07, unaryPlus(input07));
                    test.assertEqual(input09, unaryPlus(input09));
                    test.assertEqual(input10, unaryPlus(input10));
                    test.assertEqual(input11, unaryPlus(input11));
                    test.assertEqual(input12, unaryPlus(input12));
                    test.assertEqual(input13, unaryPlus(input13));
                    test.assertEqual(input14, unaryPlus(input14));

                    test.complete();
                }
            },
            {
                name: "Numeric = INF -> returned as is",
                exec: function(test){
                    var input01 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input02 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input03 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input04 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input05 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input06 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input07 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger>', test);
                    var input08 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input09 = new Node('"-INF"^^<http://www.w3.org/2001/XMLSchema#positiveInteger>', test);
                    var input10 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#short>', test);
                    var input11 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedLong>', test);
                    var input12 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedInt>', test);
                    var input13 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedShort>', test);
                    var input14 = new Node('"INF"^^<http://www.w3.org/2001/XMLSchema#unsignedByte>', test);

                    test.assertEqual(input01, unaryPlus(input01));
                    test.assertEqual(input02, unaryPlus(input02));
                    test.assertEqual(input03, unaryPlus(input03));
                    test.assertEqual(input04, unaryPlus(input04));
                    test.assertEqual(input05, unaryPlus(input05));
                    test.assertEqual(input06, unaryPlus(input06));
                    test.assertEqual(input07, unaryPlus(input07));
                    test.assertEqual(input08, unaryPlus(input08));
                    test.assertEqual(input09, unaryPlus(input09));
                    test.assertEqual(input10, unaryPlus(input10));
                    test.assertEqual(input11, unaryPlus(input11));
                    test.assertEqual(input12, unaryPlus(input12));
                    test.assertEqual(input13, unaryPlus(input13));
                    test.assertEqual(input14, unaryPlus(input14));

                    test.complete();
                }
            },
            {
                name: "Non Numeric -> Exception thrown",
                exec: function(test){
                    var input1 = new Node('<http://www.w3.org/2001/XMLSchema#boolean>', test);
                    var input2 = new Node('_:asdf', test);

                    try {
                        unaryPlus(input1);
                        test.assertFail();
                    } catch(err) {
                        test.assertIsObject(err, "exception was thrown");
                        test.assertEqual("err:FORG0006",err.error);
                        test.assertEqual("Invalid argument type", err.message);
                        test.assertEqual("http://www.w3.org/TR/xpath-functions/#ERRFORG0006", err.see);
                        test.assertEqual(input1, err.input);
                        test.assertEqual("jazzHands/query/function/numeric-unary-plus", err.module);
                    }

                    try {
                        unaryPlus(input2);
                        test.assertFail();
                    } catch(err) {
                        test.assertIsObject(err, "exception was thrown");
                        test.assertEqual("err:FORG0006",err.error);
                        test.assertEqual("Invalid argument type", err.message);
                        test.assertEqual("http://www.w3.org/TR/xpath-functions/#ERRFORG0006", err.see);
                        test.assertEqual(input2, err.input);
                        test.assertEqual("jazzHands/query/function/numeric-unary-plus", err.module);
                    }

                    test.complete();
                }
            }
        ]
    });
});