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
 * @module jazzHands.query.function.concat
 */
define([
    "RdfJs/node/Literal"
], function (LiteralNode) {
    /**
     * returns  substring of the input string
     * @see http://www.w3.org/TR/xpath-functions/#func-concat
     * @param {Object} execData
     * @param {jazzHands.query.DataRow} dataRow
     * @param {...jazzHands.query._Expression} expression
     * @return {Null | *}
     */
    function concat(execData, dataRow, expression) {
        var parts = [].splice.call(arguments, 2).map(function (expression) {
            return expression.resolve(execData, dataRow);
        });

        var language = parts.every(function (literal) {
            return literal.language === parts[0].language;
        });
        var dataType = parts.every(function (literal) {
            return literal.datatype === parts[0].datatype;
        });
        var string = parts.map(function (literal) {
            return literal.valueOf();
        }).join("");
        return new LiteralNode(string, language, dataType);
    }

    return concat;
});
