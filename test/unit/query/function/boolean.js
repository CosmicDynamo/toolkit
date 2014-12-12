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
 * @module jazzHands.test.unit.query.function.boolean
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/function/boolean",
    "RdfJs/test/fake/Node"
], function (TestPackage, boolean, Node) {
    /*
     If $arg is the empty sequence, fn:boolean returns false.
     If $arg is a sequence whose first item is a node, fn:boolean returns true.
     If $arg is a singleton value of type xs:boolean or a derived from xs:boolean, fn:boolean returns $arg.
     If $arg is a singleton value of type xs:string or a type derived from xs:string, xs:anyURI or a type derived from xs:anyURI or xs:untypedAtomic, fn:boolean returns false if the operand value has zero length; otherwise it returns true.
     If $arg is a singleton value of any numeric type or a type derived from a numeric type, fn:boolean returns false if the operand value is NaN or is numerically equal to zero; otherwise it returns true.
     In all other cases, fn:boolean raises a type error [err:FORG0006].
    */
    return new TestPackage({
        module: "jazzHands/query/function/boolean",
        tests: [
            {
                name: "Empty array -> false",
                exec: function(test){
                    var rtn = boolean([]);

                    Node.testApi(rtn, test);
                    test.assertFalse(rtn.valueOf());

                    test.complete();
                }
            },
            {
                name: "Array with > 0 RDF Node -> true",
                exec: function(test){
                    var rtn1 = boolean([new Node("<>", test)]);
                    var rtn2 = boolean([new Node("_:0", test)]);
                    var rtn3 = boolean([new Node("''", test)]);

                    Node.testApi(rtn1, test);
                    test.assertTrue(rtn1.valueOf());
                    Node.testApi(rtn2, test);
                    test.assertTrue(rtn2.valueOf());
                    Node.testApi(rtn3, test);
                    test.assertTrue(rtn3.valueOf());

                    test.complete();
                }
            },
            {
                name: "Boolean Node -> input Node",
                exec: function(test){
                    var input1 = new Node('"true"^^<http://www.w3.org/2001/XMLSchema#boolean>', test);
                    var input2 = new Node('"false"^^<http://www.w3.org/2001/XMLSchema#boolean>', test);

                    test.assertEqual(input1, boolean(input1));
                    test.assertEqual(input2, boolean(input2));

                    test.complete();
                }
            },
            {
                name: "Empty String -> false",
                exec: function(test){
                    var input1 = new Node('""', test);
                    var input2 = new Node('""^^<http://www.w3.org/2001/XMLSchema#string>', test);

                    test.assertFalse(boolean(input1).valueOf());
                    test.assertFalse(boolean(input2).valueOf());

                    test.complete();
                }
            },
            {
                name: "String with length > 0 -> true",
                exec: function(test){
                    var input1 = new Node('"false"', test);
                    var input2 = new Node('"false"^^<http://www.w3.org/2001/XMLSchema#string>', test);

                    test.assertTrue(boolean(input1).valueOf());
                    test.assertTrue(boolean(input2).valueOf());

                    test.complete();
                }
            },
            {
                name: "Empty anyURI -> false",
                exec: function(test){
                    var input = new Node('""^^<http://www.w3.org/2001/XMLSchema#anyURI>', test);

                    test.assertFalse(boolean(input).valueOf());

                    test.complete();
                }
            },
            {
                name: "anyURI with length > 0 -> true",
                exec: function(test){
                    var input = new Node('"http://example.com/"^^<http://www.w3.org/2001/XMLSchema#anyURI>', test);

                    test.assertTrue(boolean(input).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric = 0 -> false",
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

                    test.assertFalse(boolean(input01).valueOf());
                    test.assertFalse(boolean(input02).valueOf());
                    test.assertFalse(boolean(input03).valueOf());
                    test.assertFalse(boolean(input04).valueOf());
                    test.assertFalse(boolean(input05).valueOf());
                    test.assertFalse(boolean(input06).valueOf());
                    test.assertFalse(boolean(input07).valueOf());
                    test.assertFalse(boolean(input08).valueOf());
                    test.assertFalse(boolean(input09).valueOf());
                    test.assertFalse(boolean(input10).valueOf());
                    test.assertFalse(boolean(input11).valueOf());
                    test.assertFalse(boolean(input12).valueOf());
                    test.assertFalse(boolean(input13).valueOf());
                    test.assertFalse(boolean(input14).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric NAN -> false",
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

                    test.assertFalse(boolean(input01).valueOf());
                    test.assertFalse(boolean(input02).valueOf());
                    test.assertFalse(boolean(input03).valueOf());
                    test.assertFalse(boolean(input04).valueOf());
                    test.assertFalse(boolean(input05).valueOf());
                    test.assertFalse(boolean(input06).valueOf());
                    test.assertFalse(boolean(input07).valueOf());
                    test.assertFalse(boolean(input08).valueOf());
                    test.assertFalse(boolean(input09).valueOf());
                    test.assertFalse(boolean(input10).valueOf());
                    test.assertFalse(boolean(input11).valueOf());
                    test.assertFalse(boolean(input12).valueOf());
                    test.assertFalse(boolean(input13).valueOf());
                    test.assertFalse(boolean(input14).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric < 0 -> true",
                exec: function(test){
                    var input1 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input2 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input3 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input4 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input5 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input6 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input7 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input8 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#short>', test);

                    test.assertTrue(boolean(input1).valueOf());
                    test.assertTrue(boolean(input2).valueOf());
                    test.assertTrue(boolean(input3).valueOf());
                    test.assertTrue(boolean(input4).valueOf());
                    test.assertTrue(boolean(input5).valueOf());
                    test.assertTrue(boolean(input6).valueOf());
                    test.assertTrue(boolean(input7).valueOf());
                    test.assertTrue(boolean(input8).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric > 0 -> true",
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

                    test.assertTrue(boolean(input01).valueOf());
                    test.assertTrue(boolean(input02).valueOf());
                    test.assertTrue(boolean(input03).valueOf());
                    test.assertTrue(boolean(input04).valueOf());
                    test.assertTrue(boolean(input05).valueOf());
                    test.assertTrue(boolean(input07).valueOf());
                    test.assertTrue(boolean(input09).valueOf());
                    test.assertTrue(boolean(input10).valueOf());
                    test.assertTrue(boolean(input11).valueOf());
                    test.assertTrue(boolean(input12).valueOf());
                    test.assertTrue(boolean(input13).valueOf());
                    test.assertTrue(boolean(input14).valueOf());

                    test.complete();
                }
            },
            {
                name: "Invalid type => Exception",
                exec: function(test){
                    var input1 = new Node('<http://www.w3.org/2001/XMLSchema#boolean>', test);
                    var input2 = new Node('_:asdf', test);

                    try {
                        boolean(input1);
                        test.assertFail();
                    } catch(err) {
                        test.assertIsObject(err, "exception was thrown");
                        test.assertEqual("err:FORG0006",err.error);
                        test.assertEqual("Invalid argument type", err.message);
                        test.assertEqual("http://www.w3.org/TR/xpath-functions/#ERRFORG0006", err.see);
                        test.assertEqual(input1, err.input);
                        test.assertEqual("jazzHands/query/function/boolean", err.module);
                    }

                    try {
                        boolean(input2);
                        test.assertFail();
                    } catch(err) {
                        test.assertIsObject(err, "exception was thrown");
                        test.assertEqual("err:FORG0006",err.error);
                        test.assertEqual("Invalid argument type", err.message);
                        test.assertEqual("http://www.w3.org/TR/xpath-functions/#ERRFORG0006", err.see);
                        test.assertEqual(input2, err.input);
                        test.assertEqual("jazzHands/query/function/boolean", err.module);
                    }

                    test.complete();
                }
            }
        ]
    });
});