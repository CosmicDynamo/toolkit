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
 * @module RdfJs.test.unit.parser.decimal
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/decimal",
    "blocks/parser/Data"
], function (TestPackage, decimal, Data) {
    return new TestPackage({
        module: "RdfJs/parser/decimal",
        tests: [
            {
                name: "return null not an decimal",
                input: "Not an decimal",
                exec: function (test) {
                    test.assertNull(decimal(test.data));

                    test.complete();
                }
            },
            {
                name: "return decimal value",
                input: "1029384756.0987654321 3",
                exec: function (test) {
                    test.assertEqual("1029384756.0987654321", decimal(test.data));

                    test.assertEqual(' ', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "return decimal value w/o whole number",
                input: ".0987654321 3",
                exec: function (test) {
                    test.assertEqual(".0987654321", decimal(test.data));

                    test.assertEqual(' ', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "null on decimal value w/o fraction didgets",
                input: "1029384756. 3",
                exec: function (test) {
                    test.assertNull(decimal(test.data));

                    test.assertEqual(0, test.data.pos);

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