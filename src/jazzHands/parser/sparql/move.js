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
 * @module $<class>$
 */
define([
    "blocks/parser/keyWord",
    "blocks/parser/required",
    "blocks/promise/when",
    "blocks/promise/all",
    "blocks/require/create",
    "./graphOrDefault"
], function (keyWord, required, when, all, create, graphOrDefault) {
    /**
     * [36] Move ::= 'MOVE' 'SILENT'? GraphOrDefault 'TO' GraphOrDefault
     * @see http://www.w3.org/TR/sparql11-query/#rMove
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function move(data) {
        var key = keyWord(data, "MOVE");
        if (key) {
            var silent = !!keyWord(data, "SILENT");
            var from = graphOrDefault(data);
            required(keyWord(data, "TO"), "MOVE missing 'TO'");
            var to = graphOrDefault(data);

            return when(all([from, to]), function (parts) {
                return create("jazzHands/query/opr/Move", {
                    silent: silent,
                    source: parts[0],
                    destination: parts[1]
                })
            })
        }
        return null;
    }

    return move;
});