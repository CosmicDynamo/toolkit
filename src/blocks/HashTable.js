/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
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
    "blocks/typeTest",
    "./genId",
    "./Container"
], function (declare, typeTest, genId, Container) {
    /**
     * Stores and Retrieves an object or value by a generated hash Id
     * @class blocks.HashTable
     */
    return declare([], {
        /** @property {blocks.Container} */
        _values: null,
        /** @property {blocks.Container} */
        _pointer: null,
        /** @property {Number} */
        length:null,
        constructor: function (args) {
            args = args || {};
            this._values = new Container();
            this._pointer = new Container();

            if (args.genHash) {
                this.genHash = args.genHash;
            }
        },
        /**
         * Gets the stored Object/value associated with a hash
         * @param {String} key - the access key
         * @return {*}
         */
        get: function (key) {
            return this._values.get(key);
        },
        /**
         * Looks up the access key for a given object
         * @param {*} value - the object/value that may have been added
         * @return {String}
         */
        lookup: function (value) {
            var hash = this.genHash(value);

            return this._pointer.get(hash);
        },
        /**
         * Adds a new Object/value to the hash and returns an access key
         * @param {*} value - The Thing being added
         * @return {String} Generated Access key
         */
        add: function (value) {
            var hash = this.genHash(value);
            var key = this._pointer.get(hash);
            if (key) {
                return key;
            }

            key = genId();

            this._values.set(key, value);
            this._pointer.set(hash, key);
            this.length++;

            return key
        },
        /**
         * Removes a key(s) from this HashTable
         * @param {String | String[]} keyOrList
         */
        remove: function (keyOrList) {
            if (typeTest.isArray(keyOrList)) {
                keyOrList.forEach(function (key) {
                    this.remove(key);
                }.bind(this));
                return;
            }

            //Value Not Found
            var data = this._values.get(keyOrList);
            if (!data){ return; }

            var hash = this.genHash(data);

            this._values.remove(keyOrList);
            this._pointer.remove(hash);

            this.length--;
        },
        /**
         * Creates a Hash from an input object
         * @description Can be overridden by more specialized method when needed
         * @param {String | Object} key
         * @return {String}
         */
        genHash: function (key) {
            //check for custom toString method and use it.  Otherwise stringify
            if (typeTest.isObject(key) && key.toString === Object.prototype.toString){
                var out = [];
                var keys = Object.keys(key).sort();

                keys.forEach(function(prop){
                    out.push(prop + ":" + this.genHash(key[prop] || ""));
                }.bind(this));
                key = "{" + out.join(",") + "}";
            }
            return key.toString();
        },
        /**
         * Runs a function on every value in this table
         * @param {forEachCallback} fn
         */
        forEach: function (fn) {
            this.keys().forEach(function (hash) {
                fn(this.get(hash), hash, this);
            }.bind(this));
        },
        /**
         * Returns all of the hash keys in this hash table
         * @returns {String[]}
         */
        keys: function () {
            return this._values.keys();
        }
    });


    /**
     * forEach callback function
     * @callback forEachCallback
     * @param {*} value
     * @param {String} hash
     * @param {blocks.HashTable} table
     */
});
