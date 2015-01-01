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
 * @module RdfJs.parser.pnCharsBase
 */
define([
    "blocks/parser/keyWord",
    "blocks/parser/matchChar",
    "blocks/parser/range",
    "./pnCharsU",
    "./pnChars",
    "RdfJs/node/Blank"
], function (keyWord, matchChar, range, pnCharsU, pnChars, BlankNode) {
    /**
     * [142] BLANK_NODE_LABEL ::= '_:' ( PN_CHARS_U | [0-9] ) ((PN_CHARS|'.')* PN_CHARS)?
     * @see http://www.w3.org/TR/sparql11-query/#rBLANK_NODE_LABEL
     * @property {blocks.parser.Data} data
     * @return {RdfJs.node.Blank | Null}
     */
    function bNodeLabel(data) {
        if (keyWord(data, "_:")) {
            var label = pnCharsU(data) || matchChar(data, "[0-9]");
            label += range(data, 0, -1, function () {
                return pnChars(data) || matchChar(data, "[.]");
            }).join("");
            label += pnChars(data) || "";
            if (label[label.length - 1] === ".") {
                throw {message: "Blank Node cannot end in '.'"};
            }
            return new BlankNode(label);
        }
        return null;
    }

    return bNodeLabel;
});