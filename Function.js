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
 */
define([
    "dojo/_base/Deferred", "dojo/when"
], function (Deferred, when) {
    if (!Function.prototype.defer) {
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
    }

    if (!Function.prototype.next) {
        Function.prototype.next = function (self, args, waitTime) {
            var fn = this;

            setTimeout(function () {
                fn.apply(self, args);
            }, waitTime || 0);
        };
    }
    return {};
});