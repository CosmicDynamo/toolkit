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
 * @module jazzHands.query.DataSet
 */
define([
    "dojo/_base/declare",
    "./DataRow"
], function (declare, DataRow) {
    /**
     * @class jazzHands.query.DataSet
     */
    return declare([], {
        /** @property {jazzHands.query.DataRow[]} */
        _rows: null,
        /** @property {Integer} length - The number of rows in this DataSet */
        _length: null,
        constructor: function () {
            this._rows = [];
            this.length = 0;
        },
        /**
         * Runs an input function on each row
         * @param {Function} fn
         */
        forEach: function (fn) {
            this._rows.forEach(fn);
        },
        /**
         * Creates a new row and adds it to the set
         * @returns {DataRow}
         */
        add: function () {
            var newRow = new DataRow();
            this._rows.push(newRow);

            this.length++;
            return newRow;
        },
        /**
         * Returns the list of columns in this DataSet.
         * @description Not every row will contain every column, so this function will return the list of all columns
         * as they appear on any row
         * @returns {String[]} The column names
         */
        columns: function () {
            var columns = {};
            this.forEach(function (row) {
                row.columns().forEach(function (key) {
                    columns[key] = true;
                });
            });

            return Object.keys(columns);
        }
    });
});