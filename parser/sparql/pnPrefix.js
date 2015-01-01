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
 * @module jazzHands.parser.sparql.pnPrefix
 */
define([
    "RdfJs/parser/pnCharsBase",
    "RdfJs/parser/pnChars",
    "blocks/parser/range",
    "blocks/parser/hasChar"
], function (pnCharsBase, pnChars, range, hasChar) {
    /**
     * [168] PN_PREFIX ::= PN_CHARS_BASE ((PN_CHARS|'.')* PN_CHARS)?
     * @see http://www.w3.org/TR/sparql11-query/#rPN_PREFIX
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function pnPrefix(data) {
        var prefix = pnCharsBase(data);
        if (prefix) {
            prefix += range(data, 0, -1, function () {
                return pnChars(data) || hasChar(data, ".");
            }).join("");
            prefix += pnChars(data) || "";
        }
        return prefix;
    }

    return pnPrefix;
});