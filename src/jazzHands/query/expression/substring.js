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
 * @module jazzHands.query.expression.Substring
 */
define([
    "dojo/_base/declare",
    "../_Expression",
    "../function/substring"
], function (declare, _Expression, substring) {
    /**
     * Mathematical expression to negate a numeric value returned by another expression
     * @class jazzHands.query.expression.Substring
     * @mixes jazzHands.query._Expression
     */
    return declare([_Expression], {
        /** @property {jazzHands.query._Expression} - string to get */
        string: null,
        /** @property {jazzHands.query._Expression} - starting position*/
        start: null,
        /** @property {jazzHands.query._Expression} - length of substring*/
        length: null,
        /**
         * Returns the negative of the expression result
         * @override jazzHands.query._Expression#resolve
         * @return {RdfJs.node.Literal<Number>}
         */
        resolve: function(dataRow){
            var string = this.string.resolve(dataRow);
            var start = this.start.resolve(dataRow);
            var length = this.length?this.length.resolve(dataRow):null;
            return substring(string, start, length);
        }
    });
});