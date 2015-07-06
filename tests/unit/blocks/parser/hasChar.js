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
 * @module blocks.test.unit.parser.hasChar
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/hasChar",
    "blocks/parser/Data"
], function (TestSuite, assert, hasChar, Data) {
    return new TestSuite({
        name: "blocks/parser/hasChar",

        "Returns character if in string": function () {
            var data = new Data({ input: "$" });
            var out = hasChar(data, "$");

            assert.strictEqual(data.input, out);
            assert.isNull(hasChar(data, "$"), "position was updated");
        },

        "Not Case sensitive by default": function () {
            var data = new Data({ input: "a" });
            var out = hasChar(data, "A");

            assert.strictEqual("a", out);
        },

        "Case sensitivity can be enabled": function () {
            var data = new Data({ input: "a" });
            var out = hasChar(data, "A", true);
            assert.isNull(out);

            out = hasChar(data, "a", true);
            assert.strictEqual("a", out);
        },

        "Can strip leading white space": function () {
            var data = new Data({ input: " a" });
            data.whiteSpace = function (data) {
                data.pos++;
            };
            var out = hasChar(data, "A", false, true);

            assert.strictEqual("a", out);
        }
    });
});