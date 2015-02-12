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
 * @module blocks.parser.hasChar
 */
define([], function () {
    /**
     * Skips over any white space at the current input position
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @param {String} ch - Information about the parsing process
     * @param {Boolean} [matchCase=false] - Skip any white space before the expression
     * @param {Boolean} [skipWhiteSpace=false] - Skip any white space before the expression
     */
    function hasChar(data, ch, matchCase, skipWhiteSpace) {
        var start = data.pos;
        if (skipWhiteSpace && data.whiteSpace) {
            data.whiteSpace(data);
        }
        if (!data.isEnd()) {
            var has = data.getCh();
            var comp = has;
            if (!matchCase) {
                comp = comp.toLowerCase();
                ch = ch.toLowerCase();
            }
            if (comp === ch) {
                data.next();
                return has;
            }
        }
        data.pos = start;
        return null;
    }

    return hasChar;
});