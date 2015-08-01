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
 * @module blocks._Disposable
 */
define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * @class blocks._Disposable
     * @mixes dojo.declare
     */
    return declare([], {
        /**
         * Indicates if this disposable was disposed
         * @type {Boolean}
         */
        wasDisposed: false,
        /**
         * Mark this object as disposed
         */
        dispose: function(){
            this.wasDisposed = true;
        },
        /**
         * Will log a message to the console if an object was already disposed
         * @param {String} [message] - message to be displayed
         * @return {Boolean} - indicates if object was actually disposed
         */
        warnDisposed: function(message){
            if (this.wasDisposed){
                console.warn(message || "Object has already been disposed");
            }
            return this.wasDisposed;
        }
    });
});