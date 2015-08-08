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
 * @module jazzHands.query.function.ArgList
 */
define([
    "dojo/_base/declare",
    "../_Expression"
], function (declare, _Expression) {
    /**
     * Executes a function with the given arguments
     * @class jazzHands.query.function.ArgList
     * @mixes jazzHands.query._Expression
     */
    return declare([_Expression], {
        /** @property {Boolean} distinct */
        distinct: null,
        /** @property {jazzHands.query._Expression[]} */
        args: null,
        /** @property {Function} */
        fn:null,
        constructor: function(){
            this.args = [];
        },
        /**
         * Executes a function with the given arguments
         * @override jazzHands.query._Expression#resolve
         * @param {Object} execData - execution data to be used generating distinct values and doing query validation
         * @param {jazzHands.query.DataRow} dataRow
         * @return {RdfJs.node.Literal<Number>}
         */
        resolve: function (execData, dataRow) {
            var args = this.args;

            args.push(this.distinct);
            return this.fn.apply(this, [execData, dataRow].concat(args));
        }
    });
});