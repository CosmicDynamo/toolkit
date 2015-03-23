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
 * @module jazzHands.test.unit.parser.match.whiteSpace
 */
define([
    "qasht/package/Unit",
    "RdfJs/parser/whiteSpace",
    "blocks/parser/Data"
], function (TestPackage, whiteSpace, Data) {
    return new TestPackage({
        module: "RdfJs/parser/whiteSpace",
        tests: [
            {
                name: "Returns ' ' characters",
                input: "          ",
                exec: function (test) {
                    var out = whiteSpace(test.data);

                    test.assertNull(out);
                    test.assertEqual(test.input.length, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Returns new line characters",
                input: "\n\n\n\n\n\n\n\n\n\n",
                exec: function (test) {
                    var out = whiteSpace(test.data);

                    test.assertNull(out);
                    test.assertEqual(test.input.length, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Returns line feed characters",
                input: "\r\r\r\r\r\r\r\r\r\r",
                exec: function (test) {
                    var out = whiteSpace(test.data);

                    test.assertNull(out);
                    test.assertEqual(test.input.length, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Returns tab characters",
                input: "\t\t\t\t\t\t\t\t\t\t",
                exec: function (test) {
                    var out = whiteSpace(test.data);

                    test.assertNull(out);
                    test.assertEqual(test.input.length, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Returns a combination of all 'white space' characters",
                input: " \n\t\n\t\n  \r\r \n\t",
                exec: function (test) {
                    var out = whiteSpace(test.data);

                    test.assertNull(out);
                    test.assertEqual(test.input.length, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Stops on a non white space character",
                input: " \n\t\n\t\n  \r\r \n\ta\n \r\t",
                exec: function (test) {
                    whiteSpace(test.data);

                    test.assertEqual("a\n \r\t", test.input.substr(test.data.pos));

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input
            });
        }
    });
});