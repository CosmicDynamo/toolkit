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
 * @module blocks.parser.block
 */
define([
    "blocks/promise/when",
    "./hasChar",
    "./range",
    "./find",
    "./required"
], function (when, hasChar, range, find) {
    /**
     * Returns the values from a block of text surrounded by start and end characters
     */
    function block(data, startChar, endChar, min, max, fn, sep) {
        var start = data.pos;
        if (hasChar(data, startChar, false, true)) {
            return when(range(data, min, max, function () {
                return find(data, [fn]);
            }, sep), function (out) {
                if (hasChar(data, endChar, false, true)) {
                    return out;
                }
                data.pos = start;
                return null;
            });
        }
        return null;
    }

    return block
});