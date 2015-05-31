/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
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
 * @module blocks.test.unit.parser.matchChar
 */
define([
    "qasht/package/Unit",
    "blocks/parser/matchChar",
    "blocks/parser/Data"
], function (TestPackage, matchChar, Data) {
    return new TestPackage({
        module: "blocks/parser/matchChar",
//This is a basic RegEx machine.  And in leu of testing all RegEx, I will just validate a few cases I care about
        tests: [
            {
                name: "Match Alpha-Numeric",
                input: "afe0DS2v#",
                exec: function (test) {
                    test.assertEqual("a", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("f", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("e", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("0", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("D", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("S", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("2", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertEqual("v", matchChar(test.data, "[a-zA-Z0-9]"));
                    test.assertNull(matchChar(test.data, "[a-zA-Z0-9]"));

                    test.complete();
                }
            },
            {   //#x20 | #x9 | #xD | #xA
                name: "Match white space characters",
                input: " \n\t\rC",
                exec: function (test) {
                    test.assertEqual(" ", matchChar(test.data, "[\x20|\x09|\x0D|\x0A]"));
                    test.assertEqual("\n", matchChar(test.data, "[\x20|\x09|\x0D|\x0A]"));
                    test.assertEqual("\t", matchChar(test.data, "[\x20|\x09|\x0D|\x0A]"));
                    test.assertEqual("\r", matchChar(test.data, "[\x20|\x09|\x0D|\x0A]"));

                    test.assertNull(matchChar(test.data, "[\x20|\x09|\x0D|\x0A]"));

                    test.complete();
                }
            },
            {   //[0-9] | #x00B7 | [#x0300-#x036F] | [#x203F-#x2040]
                name: "Two character ASCII",
                input: "\xB7x\u0300x\u036Fx\u203Fx\u2040",
                exec: function (test) {
                    test.assertEqual("\xB7", matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.assertNull(matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.data.pos++;

                    test.assertEqual("\u0300", matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.assertNull(matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.data.pos++;

                    test.assertEqual("\u036F", matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.assertNull(matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.data.pos++;

                    test.assertEqual("\u203F", matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.assertNull(matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
                    test.data.pos++;

                    test.assertEqual("\u2040", matchChar(test.data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));

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