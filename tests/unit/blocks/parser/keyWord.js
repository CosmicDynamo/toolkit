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
 * @module jazzHands.test.unit.parser.match.keyWord
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/keyWord",
    "blocks/parser/Data"
], function (TestSuite, assert, keyWord, Data) {
    return new TestSuite({
        name: "blocks/parser/keyWord",

        "returns the key word if it is next in the string": function () {
            var data = new Data({
                input: "The quick brown fox jumps over the lazy dog"
            });
            var out = keyWord(data, "THE");

            assert.strictEqual("THE", out);
            assert.strictEqual(3, data.pos);
        },
 
        "returns null if it is not next in the string": function () {
            var data = new Data({
                input: " The quick brown fox jumps over the lazy dog"
            });
            var out = keyWord(data, "The");

            assert.isNull(out);
            assert.strictEqual(0, data.pos);
        },

        "matchCase: returns the key word if it is next in the string": function () {
            var data = new Data({
                input: "The quick brown fox jumps over the lazy dog"
            });
            var out = keyWord(data, "The");

            assert.strictEqual("The", out);
            assert.strictEqual(3, data.pos);
            },
            
        "matchCase: returns null if it is not next in the string": function () {
            var data = new Data({
                input: "The quick brown fox jumps over the lazy dog"
            });
            var out = keyWord(data, "THE", true);

            assert.isNull(out);
            assert.strictEqual(0, data.pos);
        },

        "white-space: can ignore leading white space": function () {
        
            var data = new Data({
                input: " The quick brown fox jumps over the lazy dog"
            });
            data.whiteSpace = function (data) {
                data.pos++;
            };
            var out = keyWord(data, "THE", false, true);

            assert.strictEqual("THE", out);
        }
    });
});