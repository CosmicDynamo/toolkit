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
    "dojo/_base/lang",
    "./Container"
], function (declare, lang, Container) {
    /**
     * Supposed to be a module for handling the caching of data requests so that if an entry is not defined it will call an
     * input get method your code can override
     * @class blocks.Cache
     * @mixes dojo.declare
     * @mixes blocks.Container
     */
    return declare([], {
        /** @property {blocks.Container} */
        _values: null,
        constructor: function (args) {
            this._values = new Container();

            this.load = args.load;
            if (args.getHash) {
                this.getHash = args.getHash;
            }
        },
        /**
         * Gets a value from the cache
         * @param {*} key
         * @return {*}
         */
        get: function (key) {
            var id = this.getHash(key);

            var val = this._values.get(id);
            if (val == null){
                val = this.load(key);
                this._values.set(id, val);
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
         * Creates a Hash from an input object
         * @description Intended to be overridden by more complex Caches
         * @param {String | Object} key
         * @return {String}
         */
        getHash: function (key) {
            if (lang.isObject(key)){
                var out = [];
                var keys = Object.keys(key).sort();

                keys.forEach(function(prop){
                    out.push(prop + ":" + this.getHash(key[prop]));
                }.bind(this));
                key = "{" + out.join(",") + "}";
            }
            return key;
        }
    })
});
