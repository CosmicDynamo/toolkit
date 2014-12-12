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
 * @module jazzHands.test.unit.query.expression.logic.Not
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/expression/logic/Not",
    "RdfJs/test/fake/Node"
], function (TestPackage, Not, Node) {
    /*
      Return !not($arg)
    */
    return new TestPackage({
        module: "jazzHands/query/expression/logic/not",
        tests: [
            {
                name: "Empty array -> true",
                return:[],
                exec: function(test){
                    var rtn = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn, test);
                    test.assertTrue(rtn.valueOf());

                    test.complete();
                }
            },
            {
                name: "Array with > 0 RDF Node -> false",
                exec: function(test){
                    test.dataRow.value= [new Node("<>", test)];
                    var rtn1 = test.expr.resolve(test.dataRow);
                    test.dataRow.value= [new Node("_:0", test)];
                    var rtn2 = test.expr.resolve(test.dataRow);
                    test.dataRow.value= [new Node("''", test)];
                    var rtn3 = test.expr.resolve(test.dataRow);

                    Node.testApi(rtn1, test);
                    test.assertFalse(rtn1.valueOf());
                    Node.testApi(rtn2, test);
                    test.assertFalse(rtn2.valueOf());
                    Node.testApi(rtn3, test);
                    test.assertFalse(rtn3.valueOf());

                    test.complete();
                }
            },
            {
                name: "Boolean Node -> input Node",
                exec: function(test){
                    var input1 = new Node('"true"^^<http://www.w3.org/2001/XMLSchema#boolean>', test);
                    var input2 = new Node('"false"^^<http://www.w3.org/2001/XMLSchema#boolean>', test);

                    test.dataRow.value = input1;
                    test.assertNotEqual(input1, test.expr.resolve(test.dataRow));
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());

                    test.dataRow.value = input2;
                    test.assertNotEqual(input2, test.expr.resolve(test.dataRow));
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Empty String -> tre",
                exec: function(test){
                    var input1 = new Node('""', test);
                    var input2 = new Node('""^^<http://www.w3.org/2001/XMLSchema#string>', test);

                    test.dataRow.value = input1;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input2;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "String with length > 0 -> false",
                exec: function(test){
                    var input1 = new Node('"false"', test);
                    var input2 = new Node('"false"^^<http://www.w3.org/2001/XMLSchema#string>', test);

                    test.dataRow.value = input1;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input2;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Empty anyURI -> true",
                exec: function(test){
                    test.dataRow.value = new Node('""^^<http://www.w3.org/2001/XMLSchema#anyURI>', test);
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "anyURI with length > 0 -> false",
                exec: function(test){
                    test.dataRow.value = new Node('"http://example.com/"^^<http://www.w3.org/2001/XMLSchema#anyURI>', test);
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric = 0 -> true",
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
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input02;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input03;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input04;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input05;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input06;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input07;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input08;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input09;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input10;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input11;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input12;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input13;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input14;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric NAN -> true",
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
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input02;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input03;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input04;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input05;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input06;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input07;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input08;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input09;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input10;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input11;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input12;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input13;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input14;
                    test.assertTrue(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric < 0 -> false",
                exec: function(test){
                    var input1 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#byte>', test);
                    var input2 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#decimal>', test);
                    var input3 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#int>', test);
                    var input4 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#integer>', test);
                    var input5 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#long>', test);
                    var input6 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#negativeInteger>', test);
                    var input7 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#nonPositiveInteger>', test);
                    var input8 = new Node('"-1"^^<http://www.w3.org/2001/XMLSchema#short>', test);

                    test.dataRow.value = input1;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input2;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input3;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input4;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input5;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input6;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input7;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input8;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Numeric > 0 -> false",
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

                    test.dataRow.value = input01;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input02;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input03;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input04;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input05;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input07;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input09;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input10;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input11;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input12;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input13;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());
                    test.dataRow.value = input14;
                    test.assertFalse(test.expr.resolve(test.dataRow).valueOf());

                    test.complete();
                }
            },
            {
                name: "Invalid type => Exception",
                exec: function(test){
                    var input1 = new Node('<http://www.w3.org/2001/XMLSchema#boolean>', test);
                    var input2 = new Node('_:asdf', test);

                    try {
                        test.dataRow.value = input1;
                        test.expr.resolve(test.dataRow);
                        test.assertFail();
                    } catch(err) {
                        test.assertIsObject(err, "exception was thrown");
                    }

                    try {
                        test.dataRow.value = input2;
                        test.expr.resolve(test.dataRow);
                        test.assertFail();
                    } catch(err) {
                        test.assertIsObject(err, "exception was thrown");
                    }

                    test.complete();
                }
            }
        ],
        setUp: function(test){
            test.dataRow = {
                "value":test.return
            };
            test.expr = new Not({
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