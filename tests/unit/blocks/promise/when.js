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
    "qasht/package/Unit",
    "block/promise/when",
    "dojo/_base/Deferred"
], function (TestPackage, when, Deferred) {
    return new TestPackage({
        module: "block/promise/when",
        tests: [
            {
                name: "API",
                exec: function (test) {
                    test.assertIsFunciton(when, "when is a function");

                    test.complete();
                }
            },
            {
                name: "when: takes a non-promise and calls the callback",
                exec: function (test) {
                    var input = "A Value";
                    var rtn = "A Return";
                    var fnArg = null;
                    var output = when(input, function(arg){
                        fnArg = arg;
                        return rtn;
                    });

                    test.assertEqual(input, fnArg, "Input was passed into callback");
                    test.assertEqual(rtn, output, "callback return was returned from when");

                    test.complete();
                }
            },
            {
                name: "when: handles null input",
                exec: function (test) {
                    var input = null;
                    var rtn = null;
                    var fnArg;
                    var output = when(input, function(arg){
                        fnArg = arg;
                        return rtn;
                    });

                    test.assertEqual(input, fnArg, "Input was passed into callback");
                    test.assertEqual(rtn, output, "callback return was returned from when");

                    test.complete();
                }
            },
            {
                name: "when: takes a promise and calls the callback when resolved",
                exec: function (test) {
                    var input = new Deferred();
                    var rtn = "A Return";
                    var fnArg = null;
                    var output = when(input, function(arg){
                        fnArg = arg;
                        return rtn;
                    });

                    test.assertNotEqual(input, fnArg, "Input was not passed into callback before promise resolved");
                    test.assertNotEqual(rtn, output, "callback return was not returned from when before promise resolved");

                    input.resolve("A Value");

                    test.whenResolved(output, function(arg){
                        test.assertEqual("A Value", fnArg, "Promise resolution was passed to callback");
                        test.assertEqual(rtn, arg, "Function return was returned");

                        test.complete();
                    });
                }
            },
            {
                name: "when: takes a promise and calls the errback when rejected",
                exec: function (test) {
                    var input = new Deferred();
                    var rtn = "A Return";
                    var fnArg = null;
                    var output = when(input, function(){
                        test.assertFail("Callback should not be called");
                    }, function(arg){
                        fnArg = arg;
                        return rtn;
                    });

                    test.assertNotEqual(input, fnArg, "Input was not passed into callback before promise resolved");
                    test.assertNotEqual(rtn, output, "callback return was not returned from when before promise resolved");

                    input.reject("A Value");

                    test.whenRejected(output, function(arg){
                        test.assertEqual("A Value", fnArg, "Promise resolution was passed to callback");
                        test.assertEqual(rtn, arg, "Function return was returned");

                        test.complete();
                    });
                }
            },
            {
                name: "when: takes a promise and calls the progback on progress",
                exec: function (test) {
                    var input = new Deferred();
                    var rtn = "A Return";
                    var fnArg = null;
                    var output = when(input, function(){
                        test.assertFail("Callback should not be called");
                    }, function(){
                        test.assertFail("ErrorBack should not be called");
                    }, function(arg){
                        fnArg = arg;
                        return rtn;
                    });

                    test.assertNotEqual(input, fnArg, "Input was not passed into callback before promise resolved");
                    test.assertNotEqual(rtn, output, "callback return was not returned from when before promise resolved");

                    input.progress("A Value");

                    test.whenRejected(output, function(arg){
                        test.assertEqual("A Value", fnArg, "Promise resolution was passed to callback");
                        test.assertEqual(rtn, arg, "Function return was returned");

                        test.complete();
                    });
                }
            },
            {
                name: "when: return promise resolved when callback return resolved",
                exec: function (test) {
                    var input = new Deferred();
                    var rtn = new Deferred();
                    var fnArg = null;
                    var output = when(input, function(arg){
                        fnArg = arg;
                        return rtn;
                    });

                    test.assertNotEqual(input, fnArg, "Input was not passed into callback before promise resolved");
                    test.assertNotEqual(rtn, output, "callback return was not returned from when before promise resolved");

                    input.resolve("A Value");

                    test.whenResolved(output, function(arg){
                        test.assertEqual("A Value", fnArg, "Promise resolution was passed to callback");
                        test.assertEqual("A Return", arg, "Function return was returned");

                        test.complete();
                    });

                    rtn.resolve("A Return");
                }
            }
        ]
    });
});