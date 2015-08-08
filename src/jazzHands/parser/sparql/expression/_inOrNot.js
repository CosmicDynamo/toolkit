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
 * @module jazzHands.parser.sparql.expression
 */
define([
    "blocks/promise/when",
    "blocks/parser/anyKeyWord",
    "blocks/require/create",
    "./list"
], function (when, anyKeyWord, create, expressionList) {
    /**
     * [Helper] InOrNot ::= NumericExpression 'NOT'? 'IN' ExpressionList
     * @see http://www.w3.org/TR/sparql11-query/#rConditionalOrExpression
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function _inExpression(data, left) {
        var list = anyKeyWord(data, ['IN', 'NOT']);
        if (!list || (list === "NOT" && !anyKeyWord(data, ['IN']))) {
            data.pos = start;
            return null;
        }
        return when(expressionList(data), function (right) {
            var opr = create("jazzHands/query/expression/In", {
                left: left,
                expressions: right
            });
            if (list === "IN") {
                return opr;
            }

            return when(opr, function (expression) {
                return create("jazzHands/query/expression/logic/Not", {
                    expression: expression
                });
            });
        });
    }

    return _inExpression;
});