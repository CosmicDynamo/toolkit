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
 * @module jazzHands.test.unit.parser.char.eChar
 */
define([
    "qasht/package/Unit",
    "blocks/parser/eChar",
    "blocks/parser/Data"
], function (TestPackage, eChar, Data) {
    return new TestPackage({
        module: "blocks/parser/eChar",
        tests: [
            {
                name: "valid syntax: '\\t'",
                input: "\\t",
                exec: function (test) {
                    test.assertEqual("\\t", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\b'",
                input: "\\b",
                exec: function (test) {
                    test.assertEqual("\\b", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\n'",
                input: "\\n",
                exec: function (test) {
                    test.assertEqual("\\n", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\r'",
                input: "\\r",
                exec: function (test) {
                    test.assertEqual("\\r", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\f'",
                input: "\\f",
                exec: function (test) {
                    test.assertEqual("\\f", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\\\'",
                input: "\\\\",
                exec: function (test) {
                    test.assertEqual("\\\\", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\\'",
                input: "\\'",
                exec: function (test) {
                    test.assertEqual("\\'", eChar(test.data));

                    test.assertNull(eChar(test.data));

                    test.complete();
                }
            },
            {
                name: "valid syntax: '\\\"'",
                input: "\\\"",
                exec: function (test) {
                    test.assertEqual('\\"', eChar(test.data));

                    test.assertNull(eChar(test.data));

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