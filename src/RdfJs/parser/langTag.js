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
 * @module RdfJs.parser.langTag
 */
define([
    "blocks/parser/hasChar",
    "blocks/parser/required",
    "blocks/parser/range",
    "blocks/parser/matchChar"
], function (hasChar, required, range, matchChar) {
    var errMsg = "invalid langTag";

    /**
     * [145] LANGTAG ::= '@' [a-zA-Z]+ ('-' [a-zA-Z0-9]+)*
     * @see http://www.w3.org/TR/sparql11-query/#rLANGTAG
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function langTag(data) {
        var value = hasChar(data, '@', true, true);
        if (value) {
            var match = "[a-zA-Z]";
            value = range(data, 1, -1, function () {
                var part = range(data, 1, -1, function () {
                    return matchChar(data, match);
                });

                match = "[a-zA-Z0-9]";
                return required(part, errMsg).join("");
            }, "-", false);
            value = required(value, errMsg).join("-")
        }
        return value;
    }

    return langTag;
});