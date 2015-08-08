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
 * @module jazzHands.query.function.substring
 */
define([
    "jazzHands/query/exception/ParameterMismatch"
], function (ParameterMismatch) {
    /**
     * returns  substring of the input string
     * @see http://www.w3.org/TR/xpath-functions/#func-substring
     * @param {Object} execData
     * @param {jazzHands.query.DataRow} dataRow
     * @param {jazzHands.query._Expression} sourceExpr
     * @param {jazzHands.query._Expression} findExpr
     * @return {RdfJs.node.Literal<String>}
     * @throws err:FORG0006, Invalid argument type
     */
    function substring(execData, dataRow, sourceExpr, findExpr) {
        var source = sourceExpr.resolve(execData, dataRow);
        var find = findExpr.resolve(execData, dataRow).valueOf();
        if (source.language && find.language) {
            if (source.language === find.language) {
                throw new ParameterMismatch({
                    param1: source,
                    param2: find,
                    hint: "string language must match, if provided",
                    module: "jazzHands/query/function/substring-before"
                });
            }
        }

        var string = source.valueOf();
        var foundAt = string.indexOf(find);

        var language = null;
        var dataType = null;
        if (foundAt > -1) {
            language = source.language;
            dataType = source.datatype;
        }
        return new LiteralNode(string.substr(0, foundAt), language, dataType);
    }

    return substring;
});
