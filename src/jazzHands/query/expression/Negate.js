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
 * @module jazzHands.query.expression.Negate
 */
define([
    "dojo/_base/declare",
    "../_Expression",
    "../function/numeric-unary-minus"
], function (declare, _Expression, unaryMinus) {
    /**
     * Mathematical expression to negate a numeric value returned by another expression
     * @class jazzHands.query.expression.Negate
     * @mixes jazzHands.query._Expression
     */
    return declare([_Expression], {
        /** @property {jazzHands.query._Expression} - Numeric express to be negated */
        expression: null,
        /**
         * Returns the negative of the expression result
         * @override jazzHands.query._Expression#resolve
         * @return {RdfJs.node.Literal<Number>}
         */
        resolve: function(dataRow){
            return unaryMinus(this.expression.resolve(dataRow));
        }
    });
});