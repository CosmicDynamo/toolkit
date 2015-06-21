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
 * @module polyfill.Function.defer
 */
define([
    "dojo/Deferred",
    "dojo/promise/when"
], function (Deferred, when) {
    /**
     * Delays execution of a function and then returns a promise that will resolve when the function is complete
     * @param {Object} self - Function execution context
     * @param {Array<*>} args - Arguments to pas into the function
     * @param {Number} waitTime - wait time in ms
     * @return {dojo.Deferred}
     */
    Function.prototype.defer = function (self, args, waitTime) {
        var fn = this;

        var done = new Deferred();
        setTimeout(function () {
            try {
                when(fn.apply(self, args), done.resolve, done.reject, done.progress);
            } catch (ex) {
                done.reject(ex);
            }
        }, waitTime || 0);
        return done;
    };
});