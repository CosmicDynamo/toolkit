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
 * @module tests.api.blocks.Observable
 */
define([
    "intern/chai!assert",
    "api/blocks/_Disposable"
], function (assert, testDisposableApi) {
    /**
     * @method tests.api.blocks.Observable
     */
    return function(instance, message){
        if (message){
            message += ": "
        } else {
            message = "";
        }

        testDisposableApi(instance, "Observables MUST have a disposed Observable");

        assert.isFunction(instance.next, message + "Observables MUST have a next Method");
        assert.isFunction(instance.complete, message + "Observables MUST have a complete Method");
        assert.isFunction(instance.error, message + "Observables MUST have an error Method");
        assert.isFunction(instance.subscribe, message + "Observables MUST have a subscribe Method");
        assert.isFunction(instance.forEach, message + "Observables MUST have a forEach Method");
        assert.isFunction(instance.take, message + "Observables MUST have a take Method");
        assert.isFunction(instance.takeUntil, message + "Observables MUST have a takeUntil Method");
        assert.isFunction(instance.mergeWith, message + "Observables MUST have a mergeWith Method");
        assert.isFunction(instance.push, message + "Observables MUST have a push Method");
        assert.isFunction(instance.filter, message + "Observables MUST have a filter Method");
        assert.isFunction(instance.map, message + "Observables MUST have a map Method");
        assert.isFunction(instance.throttle, message + "Observables MUST have a throttle Method");
    }
});