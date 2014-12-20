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
 * @module RdfJs.test.unit.parser.numeric
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/numeric",
    "blocks/parser/Data"
], function (TestPackage, numeric, Data) {
    return new TestPackage({
        module: "RdfJs/parser/numeric",
        tests: [
            {
                name: "return null not an numeric",
                input: "Not an numeric",
                exec: function (test) {
                    test.assertNull(numeric(test.data));

                    test.complete();
                }
            },
            {
                name: "return numeric value",
                input: "1029384756.0987654321 3",
                exec: function (test) {
                    var rtn = numeric(test.data);
                    test.assertTrue(rtn.isLiteral());
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#decimal", rtn.datatype);
                    test.assertEqual(1029384756.0987654321, rtn.valueOf());

                    test.assertEqual(' ', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "return numeric value w/o whole numeric",
                input: ".0987654321 3",
                exec: function (test) {
                    var rtn = numeric(test.data);
                    test.assertTrue(rtn.isLiteral());
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#decimal", rtn.datatype);
                    test.assertEqual(.0987654321, rtn.valueOf());

                    test.assertEqual(' ', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "integer return on numeric value w/ '.' but no fraction digits",
                input: "1029384756. 3",
                exec: function (test) {
                    var rtn = numeric(test.data);
                    test.assertTrue(rtn.isLiteral());
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#integer", rtn.datatype);
                    test.assertEqual(1029384756, rtn.valueOf());

                    test.assertEqual('.', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "integer return on numeric value w/o fraction digits",
                input: "1029384756 3",
                exec: function (test) {
                    var rtn = numeric(test.data);
                    test.assertTrue(rtn.isLiteral());
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#integer", rtn.datatype);
                    test.assertEqual(1029384756, rtn.valueOf());

                    test.assertEqual(' ', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "double return if value contains exponent",
                input: "1.e2 3e-4 .5e6 7.8e9",
                exec: function (test) {
                    var rtn = numeric(test.data);
                    test.assertTrue(rtn.isLiteral());
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#double", rtn.datatype);
                    test.assertEqual(1e2, rtn.valueOf());
                    test.data.pos++;
                    test.assertEqual(3e-4, numeric(test.data).valueOf());
                    test.data.pos++;
                    test.assertEqual(.5e6, numeric(test.data).valueOf());
                    test.data.pos++;
                    test.assertEqual(7.8e9, numeric(test.data).valueOf());

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input
            })
        }
    });
});