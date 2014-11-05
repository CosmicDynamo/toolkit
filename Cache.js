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
    return declare([Container], {
        _pointer: null,
        _empty: null,
        constructor: function (parent, fnName) {
            this.parent = parent;
            this.fnName = fnName;

            if (parent.getObjectId) {
                this.getObjectId = parent.getObjectId;
            }
        },
        /**
         * Gets a value
         * @param {String} name
         * @return {*} value
         */
        get: function (name) {
            arguments[0] = this.getObjectId(name);

            var val = this.inherited(arguments);
            if (val === null) {
                return this.parent[this.fnName](name);
            }
        },
        /**
         * Sets a value
         * @param {String} name
         * @param {*} value
         */
        set: function (name, value) {
            arguments[0] = this.getObjectId(name);

            this.inherited(arguments)
        },
        /**
         * Creates a Hash from an input object
         * @description Intended to be overridden by more complex Caches
         * @param {String} name
         * @return {String}
         */
        getObjectId: function (name) {
            return name;
        }
    })
});
