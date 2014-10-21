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
 * @module blocks.HashTable
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang"
], function (declare, lang) {
    /**
     * @class blocks.HashTable
     */
    return declare([], {
        _values: null,
        _pointer: null,
        _empty: null,
        constructor: function (p) {
            this._values = [];
            this._pointer = {};
            this._empty = [];

            if (p && p.getObjectId) {
                this.getObjectId = p.getObjectId;
            }
        },
        get: function (ptr) {
            return this._values[ptr];
        },
        getPointer: function (value) {
            var id = this.getObjectId(value);
            var info = this._pointer[id];
            if (info) {
                return info.ptr;
            }
            return null;
        },
        add: function (value) {
            var idx;
            var id = this.getObjectId(value);
            var info = this._pointer[id];
            if (info) {
                info.ct++;
                return info.ptr;
            }

            if (this._empty.length > 0) {
                idx = this._empty.splice(0, 1)[0];
            } else {
                idx = this._values.length;
            }
            this._values[idx] = value;
            this._pointer[id] = {
                ptr: idx,
                ct: 1
            };

            this.onChange();

            return idx
        },
        remove: function (ptr) {
            if (lang.isArray(ptr)) {
                ptr.forEach(function (val) {
                    this.remove(val);
                }.bind(this))
            }

            var val = this.getObjectId(this._values[ptr]);
            var info = this._pointer[val];
            if (info && --info.ct == 0) {
                this._empty.push(ptr);
                this._values[ptr] = null;
                delete this._pointer[val];
            }

            this.onChange();
        },
        getObjectId: function (value) {
            return value.toString();
        },
        onChange: function () {
            this.length = this._values.length - this._empty.length;
        },
        forEach: function (fn) {
            return this._values.forEach(function (val) {
                if (val != null) {
                    fn(val);
                }
            });
        },
        /**
         * Returns all of the Pointers in this hash table
         * @param {Number} [limit] - max number of values
         * @returns {String[]}
         */
        getAllPointers: function (limit) {
            var out = [];
            if (limit == null) {
                limit = this._values.length;
            }
            for (var idx = 0; idx < this._values.length && out.length < limit; idx++) {
                var val = this._values[idx];
                if (val != null) {
                    out.push(idx);
                }
            }

            return out;
        }
    })
});
