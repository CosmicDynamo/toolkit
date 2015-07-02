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
 * @module blocks.test.unit.promise.all
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/promise/all",
    "dojo/_base/Deferred"
], function (TestSuite, assert, all, Deferred) {
    return new TestSuite({
        name: "blocks/promise/all",
        "API": function () {
            assert.isFunction(all, "all is a function");
        },
        "all: can take a single value: not a promise": function(){
            var result = all("someValue");
            assert.strictEqual("someValue", result[0], "returns value as-is");
        },
        "all: can take a single value: promise": function(){
            var input = new Deferred();
            var result = all(input).then(function(rtn){
                assert.strictEqual("1", rtn[0], "Resolution includes each promises resolution");
            }, function(reason){
                assert.ok(false, reason);
            });

            assert.notStrictEqual(input, result, "Return does not match input");
            assert.isFunction(result.then, "Return is a promise");
            input.resolve("1");
        },
        "all: can take an array of values: not a promise": function(){
            var input = ["Value1", "Value2"];
            var result = all(input);

            assert.isTrue(result.every(function(val, idx){
                return input[idx] === val;
            }));
        },
        "all: can take an array of values: promise": function(){
            var input = [new Deferred(), new Deferred()];
            var result = all(input).then(function(rtn){
                assert.strictEqual("1", rtn[0], "Resolution includes each promises resolution");
                assert.strictEqual("2", rtn[1], "Resolution includes each promises resolution");
            });

            assert.notStrictEqual(input, result, "Return does not match input");
            assert.isFunction(result.then, "Return is a promise");

            input[0].resolve("1");
            input[1].resolve("2");
        },
        "all: can take an array of values: mix-n-match promise": function(){
            var input = [new Deferred(), "2", new Deferred()];
            var result = all(input).then(function(rtn){
                assert.strictEqual("1", rtn[0], "Resolution includes each promises resolution");
                assert.strictEqual("2", rtn[1], "Resolution includes each promises resolution");
                assert.strictEqual("3", rtn[2], "Resolution includes each promises resolution");
            });

            assert.notStrictEqual(input, result, "Return does not match input");
            assert.isFunction(result.then, "Return is a promise");

            input[0].resolve("1");
            input[2].resolve("3");
        },
        "all: reject on any will reject all": function(){
            var input = [new Deferred(), "2", new Deferred()];
            var result = all(input).then(function(rtn){
                assert.ok(false, rtn);
            }, function(rtn){
                assert.strictEqual("err", rtn, "Rejected value is returned");
            });

            assert.notStrictEqual(input, result, "Return does not match input");
            assert.isFunction(result.then, "Return is a promise");

            input[0].resolve("1");
            input[2].reject("err");
        }
    });
});