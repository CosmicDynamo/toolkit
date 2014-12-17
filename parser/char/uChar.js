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
 * @module jazzHands.parser.char.uChar
 */
define([
    "./hex",
    "./utf16Encode",
    "../match/anyKeyWord",
    "../match/range"
], function (hex, utf16Encode, anyKeyWord, range) {
    /**
     * [26] UCHAR ::= '\u' HEX HEX HEX HEX | '\U' HEX HEX HEX HEX HEX HEX HEX HEX
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    function uChar (data, minus) {
        var start = data.pos;
        var key = anyKeyWord(data, ["\\u", "\\U"], true);
        if (key) {
            var ct = key[1] === "u" ? 4 : 8;
            var list = range(data, ct, ct, hex.bind(this));
            if (list) {
                var val = list.join("");
                var ch = utf16Encode("0x" + val);
                if (!minus || (new RegExp(minus)).test(ch)) {
                    return ch;
                }
            }
        }
        data.pos = start;
        return null;
    }
    return uChar;
});