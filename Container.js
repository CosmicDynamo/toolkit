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
 * @module blocks.Container
 */
define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * A Basic Object Container used for storing data without worrying about hasOwnProperty checks
     * @class blocks.Container
     */
    var Container = declare([], {
        _values: null,
        constructor: function (args) {
            this._values = {};

            if (args) {
                for (var x in args) {
                    if (args.hasOwnProperty(x)) {
                        this.set(x, args[x]);
                    }
                }
            }
        },
        /**
         * Removes an value from this Container
         * @param {String} name
         * @returns {*}
         */
        remove: function (name) {
            var out = this.get(name);
            delete this._values[name];
            return out;
        },
        /**
         * Sets a value for this Container
         * @param {String} name
         * @param {*} value
         */
        set: function (name, value) {
            this._values[name] = value;
        },
        /**
         * Returns a value from the container
         * @param {String} name
         * @returns {* | null}
         */
        get: function (name) {
            return (name in this._values)?this._values[name]:null;
        },
        /**
         * Returns the names of the data in this Container
         * @return {String[]}
         */
        keys: function () {
            return Object.keys(this._values);
        },
        /**
         * Creates a shallow clown of this container
         * @return {Container}
         */
        clone: function () {
            var clone = new Container();
            var original = this;
            original.keys().forEach(function (key) {
                clone.set(key, original.get(key));
            });
            return clone;
        }
    });
    return Container;
});