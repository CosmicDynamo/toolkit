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
 * @module jazzHands.query.DataRow
 */
define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * @class jazzHands.query.DataRow
     * @mixes blocks.HashTable
     * @mixes dojo.declare
     */
    return declare([], {
        /** @property {Object}
         * @private */
        _values: null,
        constructor: function () {
            this._values = {};
        },
        /**
         * Sets a column on this row
         * @param {String} name - The Column Name
         * @param {RdfJs.Node} value - Column Value
         */
        set: function (name, value) {
            this._values[name] = value
        },
        /**
         * Returns a column's value
         * @returns {RdfJs.Node | null}
         */
        get: function (name) {
            return this._values[name] || null;
        }
    });
});