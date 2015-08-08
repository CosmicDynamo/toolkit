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
 * @module jazzHands.query.Variable
 */
define([
    "dojo/_base/declare",
    "RdfJs/node/_Node"
], function (declare, _Node) {
    /**
     * @class jazzHands.query.Variable
     * @mixes RdfJs.node._Node
     * @mixes dojo._base.declare
     */
    return declare([_Node], {
        constructor: function (p) {
            this.symbol = p[0];
            this.nominalValue = p.substr(1);
            this.interfaceName = "Variable";
        },
        /** @property {String} The original symbol that was used to create this variable */
        symbol: null,
        /**
         * @override
         */
        toString: function () {
            return this.symbol + this.nominalValue;
        },
        /**
         * @override
         */
        valueOf: function () {
            return this.nominalValue;
        },
        /**
         * @override
         */
        toNT: function () {
            return null;
        },
        /**
         * Pulls the variables value from the requested data row
         * @param {Object} execData
         * @param {jazzHands.query.DataRow} dataRow - The row a value is requested from
         * @return {RdfJs.Node | null}
         */
        resolve: function (execData, dataRow) {
            var out;
            if (dataRow) {
                out = dataRow.get(this.nominalValue);
            }
            return out || null;
        }
    });
});