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
 * @module core.require
 */
define([
    "dojo/_base/Deferred",
    "./Container",
    "blocks/promise/when",
    "polyfill/has!Array.find"
], function (Deferred, Container, when) {
    var catchFailures = typeof require.on === "Function";
    if (catchFailures) {
        /**
         * Rejects the deferred i a timeout reached
         * @param {String[]} midList
         */
        require.on("error", function (err) {
            var promise = promises.get(err.info[0]);
            rejected.set(err.info[0], promise);
            if (promise && !promise.isFulfilled()) {
                promise.reject(err);
            }
        });
        var promises = new Container();
        var rejected = new Container();
    }

    /**
     * @method core.require
     * @param {String[]} mids - The modules to load
     * @param {Function} [callback] - Method to call once all modules are loaded
     */
    return function (mids, callback, errback) {
        var paths = mids.map(function(mid) {
            return require.toUrl(mid) + ".js";
        });

        var promise = new Deferred();
        if (catchFailures) {
            var fail = paths.find(function (path) {
                return rejected.get(path);
            });

            if (fail) {
                return rejected.get(fail).then(callback, errback);
            }

            paths.forEach(function (path) {
                promises.set(path, promise);
            });
        }

        var out = null;
        require(mids, function () {
            if (!promise.isFulfilled()) {
                out = arguments;
                promise.resolve(arguments);
            }
        });

        var done = function (fn, args) {
            if (catchFailures) {
                mids.forEach(function (mid) {
                    promises.remove(require.toUrl(mid) + ".js");
                });
            }

            return fn ? fn.apply(this, args) : args;
        };
        if (promise.isResolved()) {
            return done(callback, out);
        }

        return when(promise, function (modules) {
            return done(callback, modules);
        }, function(err){
            console.error(err.message);
            var out = done(errback, [err]);
            if (errback) {
                return out;
            }
            throw err;
        });
    };
});