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
 * @module jazzHands.test.unit.parser.match.hasChar
 */
define([
    "qasht/package/Unit",
    "blocks/parser/hasChar",
    "blocks/parser/Data"
], function (TestPackage, hasChar, Data) {
    return new TestPackage({
        module: "jazzHands/parser/match/hasChar",
        tests: [
            {
                name: "Returns character if in string",
                input: "$",
                exec: function (test) {
                    var out = hasChar(test.data, "$");

                    test.assertEqual(test.input, out);
                    test.assertNull(hasChar(test.data, "$"), "position was updated");

                    test.complete();
                }
            },
            {
                name: "Not Case sensitive by default",
                input: "a",
                exec: function (test) {
                    var out = hasChar(test.data, "A");

                    test.assertEqual("a", out);

                    test.complete();
                }
            },
            {
                name: "Case sensitivity can be enabled",
                input: "a",
                exec: function (test) {
                    var out = hasChar(test.data, "A", true);
                    test.assertNull(out);

                    out = hasChar(test.data, "a", true);
                    test.assertEqual("a", out);

                    test.complete();
                }
            },
            {
                name: "Can strip leading white space",
                input: " a",
                setUp: function (test) {
                    test.data.whiteSpace = function (data) {
                        data.pos++;
                    }
                },
                exec: function (test) {
                    var out = hasChar(test.data, "A", false, true);

                    test.assertEqual("a", out);

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