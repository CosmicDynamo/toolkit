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
 * @module core.Application
 */
define([
    "dojo/_base/declare",
    "blocks/promise/all",
    "blocks/promise/Queue",
    "RdfJs/TripleStore"
], function (declare, all, Queue, TripleStore) {
    /**
     * @class core.Application
     */
    return declare([], {
        /** @property {String[]} */
        components: null,
        /** @param {Object} */
        config: null,
        /** @property {Boolean | Promise} */
        started: false,
        constructor: function (params) {
            params = params || {};
            this.config = params.config || {};
            this.components = [];

            this.store = new TripleStore();
        },
        /**
         * Starts the application
         * @returns {Promise<*>}
         */
        start: function () {
            var app = this;

            var lifecycle = new Queue(this);

            lifecycle.enqueue(this._run, ["loadConfig"]);
            lifecycle.enqueue(this._run, ["init"]);
            lifecycle.enqueue(this._run, ["start"]);

            return lifecycle.enqueue(function () {
                return app;
            })
        },
        /**
         *
         * @param {String} method
         * @returns {Promise<*>}
         * @protected
         */
        _run: function (method) {
            var app = this;
            var names = this.components || [];
            var defList = names.map(function (name) {
                var fn = app[name][method];

                return fn?fn.call(app[name], app.config[name]):null;
            });

            return all(defList);
        }
    });
});