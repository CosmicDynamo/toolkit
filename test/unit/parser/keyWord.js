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
 * @module jazzHands.test.unit.parser.match.keyWord
 */
define([
    "qasht/package/Unit",
    "blocks/parser/keyWord",
    "blocks/parser/Data"
], function (TestPackage, keyWord, Data) {
    return new TestPackage({
        module: "blocks/parser/keyWord",
        tests: [
            {
                name: "returns the key word if it is next in the string",
                input: "The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = keyWord(test.data, "THE");

                    test.assertEqual("THE", out);
                    test.assertEqual(3, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "returns null if it is not next in the string",
                input: " The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = keyWord(test.data, "The");

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "matchCase: returns the key word if it is next in the string",
                input: "The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = keyWord(test.data, "The");

                    test.assertEqual("The", out);
                    test.assertEqual(3, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "matchCase: returns null if it is not next in the string",
                input: "The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = keyWord(test.data, "THE", true);

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "white-space: can ignore leading white space",
                input: " The quick brown fox jumps over the lazy dog",
                setUp: function (test) {
                    test.data.whiteSpace = function (data) {
                        data.pos++;
                    }
                },
                exec: function (test) {
                    var out = keyWord(test.data, "THE", false, true);

                    test.assertEqual("THE", out);

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