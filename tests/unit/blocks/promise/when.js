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
 * @module blocks.test.unit.promise.when
 */
define([
    "intern!object",
    "intern/chai!assert",
    "block/promise/when",
    "dojo/_base/Deferred"
], function (TestSuite, assert, when, Deferred) {
    return new TestSuite({
        name: "block/promise/when",
        "API": function () {
            assert.isFunction(when, "when is a function");
        },
        "when: takes a non-promise and calls the callback": function () {
            var input = "A Value";
            var rtn = "A Return";
            var fnArg = null;
            var output = when(input, function(arg){
                fnArg = arg;
                return rtn;
            });

            assert.strictEqual(input, fnArg, "Input was passed into callback");
            assert.strictEqual(rtn, output, "callback return was returned from when");
        },
        "when: handles null input": function () {
            var input = null;
            var rtn = null;
            var fnArg;
            var output = when(input, function(arg){
                fnArg = arg;
                return rtn;
            });

            assert.strictEqual(input, fnArg, "Input was passed into callback");
            assert.strictEqual(rtn, output, "callback return was returned from when");
        },
        "when: takes a promise and calls the callback when resolved": function () {
            var input = new Deferred();
            var rtn = "A Return";
            var fnArg = null;
            var output = when(input, function(arg){
                fnArg = arg;
                return rtn;
            });

            assert.notStrictEqual(input, fnArg, "Input was not passed into callback before promise resolved");
            assert.notStrictEqual(rtn, output, "callback return was not returned from when before promise resolved");

            input.resolve("A Value");

            var done = this.async();
            when(output, done.callback(function(arg){
                assert.strictEqual("A Value", fnArg, "Promise resolution was passed to callback");
                assert.strictEqual(rtn, arg, "Function return was returned");
            }));
        },
        "when: takes a promise and calls the errback when rejected": function () {
            var input = new Deferred();
            var rtn = "A Return";
            var fnArg = null;
            var output = when(input, function(){
                assert.ok(false, "Callback should not be called");
            }, function(arg){
                fnArg = arg;
                return rtn;
            });

            assert.notStrictEqual(input, fnArg, "Input was not passed into callback before promise resolved");
            assert.notStrictEqual(rtn, output, "callback return was not returned from when before promise resolved");

            input.reject("A Value");
            var done = this.async();
            when(output, done.errback(function(arg){
                assert.strictEqual("A Value", fnArg, "Promise resolution was passed to callback");
                assert.strictEqual(rtn, arg, "Function return was returned");
            }));
        },
        "when: takes a promise and calls the progback on progress": function () {
            var input = new Deferred();
            var rtn = "A Return";
            var fnArg = null;
            var output = when(input, function(){
                assert.ok(false, "Callback should not be called");
            }, function(){
                assert.ok(false, "ErrorBack should not be called");
            }, function(arg){
                fnArg = arg;
                return rtn;
            });

            assert.notStrictEqual(input, fnArg, "Input was not passed into callback before promise resolved");
            assert.notStrictEqual(rtn, output, "callback return was not returned from when before promise resolved");

            input.progress("A Value");

            var done = this.async();
            when(output, done.progback(function(arg){
                assert.strictEqual("A Value", fnArg, "Promise resolution was passed to callback");
                assert.strictEqual(rtn, arg, "Function return was returned");
            }));
        },
        "when: return promise resolved when callback return resolved": function () {
            var input = new Deferred();
            var rtn = new Deferred();
            var fnArg = null;
            var output = when(input, function (arg) {
                fnArg = arg;
                return rtn;
            });

            assert.notStrictEqual(input, fnArg, "Input was not passed into callback before promise resolved");
            assert.notStrictEqual(rtn, output, "callback return was not returned from when before promise resolved");

            input.resolve("A Value");

            var done = this.async();
            when(output, done.callback(function (arg) {
                assert.strictEqual("A Value", fnArg, "Promise resolution was passed to callback");
                assert.strictEqual("A Return", arg, "Function return was returned");
            }));

            rtn.resolve("A Return");
        }
    });
});