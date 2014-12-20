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
 * @module RdfJs.parser.iriRef
 */
define([
    "blocks/parser/keyWord",
    "blocks/parser/range",
    "blocks/parser/matchChar",
    "blocks/parser/uChar",
    "blocks/parser/required",
    "RdfJs/node/Named"
], function (keyWord, range, matchChar, uChar, required, Named) {
    /**
     * [139] IRIREF ::= '<' ([^<>"{}|^`\]-[#x00-#x20])* '>'
     * @see http://www.w3.org/TR/sparql11-query/#rIRIREF
     *
     * From Turtle.  Trying to see if I can use both specs side by side without violating anything
     * [18] IRIREF ::= '<' ([^#x00-#x20<>"{}|^`\] | UCHAR)* '>' // #x00=NULL #01-#x1F=control codes #x20=space
     * @property {jazzHands.parser.Data} data
     * @return {RdfJs.Node | Null}
     */
    function iriRef(data) {
        if (keyWord(data, '<', true, true)) {
            var except = '[^\x00-\x20<>"{}\\|^`\\\\]';
            var rest = range(data, 0, -1, function () {
                return matchChar(data, except) || uChar(data, except);
            });

            var value = rest.join("");

            required(keyWord(data, '>'), "iriRef missing '>'");

            if (data.base && value.indexOf(":") === -1) {
                if (value[0] === "/") {
                    value = data.base.substr(0, data.base.indexOf("/", 8)) + value;
                } else if (value.length == 0 || value[0] === "#") {
                    value = data.base + value;
                } else {
                    value = data.base.substr(0, data.base.lastIndexOf("/") + 1) + value;
                }
            }
            return new Named(value);
        }
        return null;
    }

    return iriRef;
});