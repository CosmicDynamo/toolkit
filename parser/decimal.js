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
 * @module RdfJs.parser.decimal
 */
define([
    "blocks/parser/hasChar",
    "./integer"
], function (hasChar, integer) {
    /**
     * [147] DECIMAL ::= [0-9]* '.' [0-9]+
     * @see http://www.w3.org/TR/sparql11-query/#rDECIMAL
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @return {String | Null}
     */
    function decimal(data) {
        var start = data.pos;
        var whole = integer(data);
        if (hasChar(data, ".")) {
            var dec = integer(data);
            if (dec) {
                return (whole || "") + "." + dec;
            }
        }
        data.pos = start;
        return null;
    }

    return decimal;
});