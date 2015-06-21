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
 * @module blocks.promise.Queue
 */
define([
    "dojo/_base/declare",
    "./when"
], function (declare, when) {
    /**
     * Helps with synchronizing async functions by allowing you to setup a queue where each function will execute after the last' promise resolves
     * @class blocks.promise.Queue
     */
    return declare([], {
        last: null,
        constructor: function (scope, onError, onProgress) {
            this.scope = scope;
            this.onError = onError?onError.bind(scope):null;
            this.onProgress = onProgress?onProgress.bind(scope):null;
        },
        /**
         * Queues the next Function for execution
         * @param {Function} fn - Next function to run
         * @param {Array<*>} [args] - Function execution arguments
         */
        enqueue: function (fn, args) {
            var scope = this.scope;
            this.last = when(this.last, function (results) {
                return fn.apply(scope, args || [results]);
            });

            if (this.onError || this.onProgress) {
                this.last = when(this.last, function (out) {
                    return out;
                }, this.onError, this.onProgress);
            }

            return this.last;
        }
    });
});