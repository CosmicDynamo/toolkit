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
 * @module RdfJs.test.unit.parser.exponent
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/exponent",
    "blocks/parser/Data"
], function (TestPackage, exponent, Data) {
    return new TestPackage({
        module: "RdfJs/parser/exponent",
        tests: [
            {
                name: "return null if 'e' Missing",
                input: "Not an exponent",
                exec: function (test) {
                    test.assertNull(exponent(test.data));

                    test.complete();
                }
            },
            {
                name: "return exponent value",
                input: "e1029384756 3",
                exec: function (test) {
                    test.assertEqual("e1029384756", exponent(test.data));

                    test.assertEqual(' ', test.data.input[test.data.pos]);

                    test.complete();
                }
            },
            {
                name: "returns positive exponent value",
                input: "e+1029384756 2",
                exec: function (test) {
                    test.assertEqual("e+1029384756", exponent(test.data));

                    test.assertEqual(' ', test.data.input[test.data.pos]);
                    test.complete();
                }
            },
            {
                name: "returns negative exponent value",
                input: "e-1029384756 1",
                exec: function (test) {
                    test.assertEqual("e-1029384756", exponent(test.data));

                    test.assertEqual(' ', test.data.input[test.data.pos]);

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