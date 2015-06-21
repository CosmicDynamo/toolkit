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
 * @module jazzHands.query.function.boolean
 */
define([
    "./_boolean",
    "polyfill/has!String.includes"
], function (_boolean) {
    /**
     * Returns true if the input expression resolves to a Blank Node
     * @see http://www.w3.org/TR/sparql11-query/#func-bound
     * @param {Object} execData
     * @param {jazzHands.query.DataRow} dataRow
     * @param {jazzHands.query._Expression} search
     * @param {jazzHands.query._Expression} find
     * @return {RdfJs.Node}
     * @throws err:FORG0006, Invalid argument type
     */
    function isBlank(execData, dataRow, search, find) {
        var srch = search.resolve(execData, dataRow).valueOf();
        var fnd = find.resolve(execData, dataRow).valueOf();

        return _boolean(srch.includes(fnd));
    }

    return isBlank;
});