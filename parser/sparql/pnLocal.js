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
    "blocks/promise/when",
    "blocks/promise/all",
    "blocks/parser/range",
    "blocks/parser/matchChar",
    "RdfJs/parser/pnCharsU",
    "RdfJs/parser/pnChars",
    "./plx",
//Polyfills
    "polyfill/has!String.endsWith"
], function (when, all, range, matchChar, pnCharsU, pnChars, plx) {
    /**
     * [169] PN_LOCAL ::= (PN_CHARS_U | ':' | [0-9] | PLX ) ((PN_CHARS | '.' | ':' | PLX)* (PN_CHARS | ':' | PLX) )?
     * @see http://www.w3.org/TR/sparql11-query/#rPN_LOCAL
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function pnLocal(data) {
        var first = pnCharsU(data) || matchChar(data, "[:0-9]") || plx(data);
        if (!first) {
            return null;
        }

        var rest = when(first, function () {
            return range(data, 0, -1, function () {
                return pnChars(data) || matchChar(data, "[:.]") || plx(data);
            });
        });

        return when(all([first, rest]), function (parts) {
            var value = parts.map(function (part) {
                return part.join ? part.join("") : part;
            }).join("");

            while (value.endsWith(".")) {
                data.pos--;
                value = value.substr(0, value.length - 1);
            }
            return value;
        });
    }

    return pnLocal;
});