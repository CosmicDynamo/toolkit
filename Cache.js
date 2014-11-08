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
 * @module blocks.Cache
 */
define([
    "dojo/_base/declare",
    "./Container",
    "./HashTable"
], function (declare, Container, HashTable) {
    /**
     * Supposed to be a module for handling the caching of data requests so that if an entry is not defined it will call an
     * input get method your code can override
     * @class blocks.Cache
     * @mixes dojo.declare
     */
    return declare([], {
        /** @property {blocks.HashTable} */
        _keys: null,
        /** @property {blocks.Container} */
        _values: null,
        constructor: function (args) {
            this._keys = new HashTable(args);
            this._values = new Container();

            this.load = args.load;
        },
        /**
         * Gets a value from the cache
         * @param {*} value
         * @return {*}
         */
        get: function (value) {
            var key = this._keys.lookup(value);

            var val = this._values.get(key);
            if (val == null){
                val = this.load(value);
                key = this._keys.add(value);
                this._values.set(key, val);
            }

            return val;
        },
        /**
         * Loads a value that is not already in the cache
         * @param {*} id
         * @return {null}
         */
        load: function(id){
            return null;
        },
        /**
         * Removes a value from the cache so it can be re-loaded
         * @param {*} key - The key that identifies this object
         */
        remove: function(key){
            var hash = this._keys.lookup(key);

            this._values.remove(hash);
            this._keys.remove(hash);
        }
    })
});
