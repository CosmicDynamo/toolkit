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
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/matchChar",
    "blocks/parser/Data"
], function (TestSuite, assert, matchChar, Data) {
    return new TestSuite({
        name: "blocks/parser/matchChar",
//This is a basic RegEx machine.  And in leu of testing all RegEx, I will just validate a few cases I care about

        "Match Alpha-Numeric": function () {
            var data = new Data({
                input: "afe0DS2v#"
            });
            assert.strictEqual("a", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("f", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("e", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("0", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("D", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("S", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("2", matchChar(data, "[a-zA-Z0-9]"));
            assert.strictEqual("v", matchChar(data, "[a-zA-Z0-9]"));
            assert.isNull(matchChar(data, "[a-zA-Z0-9]"));

        
        },
        //#x20 | #x9 | #xD | #xA
        "Match white space characters": function () {
            var data = new Data({
                input: " \n\t\rC"
            });
            assert.strictEqual(" ", matchChar(data, "[\x20|\x09|\x0D|\x0A]"));
            assert.strictEqual("\n", matchChar(data, "[\x20|\x09|\x0D|\x0A]"));
            assert.strictEqual("\t", matchChar(data, "[\x20|\x09|\x0D|\x0A]"));
            assert.strictEqual("\r", matchChar(data, "[\x20|\x09|\x0D|\x0A]"));

            assert.isNull(matchChar(data, "[\x20|\x09|\x0D|\x0A]"));
        },
        //[0-9] | #x00B7 | [#x0300-#x036F] | [#x203F-#x2040]
        "Two character ASCII": function () {
            var data = new Data({
                input: "\xB7x\u0300x\u036Fx\u203Fx\u2040"
            });
            assert.strictEqual("\xB7", matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            assert.isNull(matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            data.pos++;

            assert.strictEqual("\u0300", matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            assert.isNull(matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            data.pos++;

            assert.strictEqual("\u036F", matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            assert.isNull(matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            data.pos++;

            assert.strictEqual("\u203F", matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            assert.isNull(matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
            data.pos++;

            assert.strictEqual("\u2040", matchChar(data, "[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]"));
        }
    });
});