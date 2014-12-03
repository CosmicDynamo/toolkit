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
 * @module blocks.test.unit.promise.all
 */
define([
    "qasht/package/Unit",
    "blocks/promise/all",
    "dojo/_base/Deferred"
], function (TestPackage, all, Deferred) {
    return new TestPackage({
        module: "blocks/promise/all",
        tests: [
            {
                name: "API",
                exec: function (test) {
                    test.assertIsFunction(all, "all is a function");

                    test.complete();
                }
            },
            {
                name: "all: can take a single value: not a promise",
                exec: function(test){
                    var result = all("someValue");

                    test.assertEqual("someValue", result[0], "returns value as-is");

                    test.complete();
                }
            },
            {
                name: "all: can take a single value: promise",
                exec: function(test){
                    var input = new Deferred();
                    var result = all(input);

                    test.assertNotEqual(input, result, "Return does not match input");
                    test.assertIsFunction(result.then, "Return is a promise");

                    test.whenResolved(result, function(rtn){
                        test.assertEqual("1", rtn[0], "Resolution includes each promises resolution");
                        test.complete();
                    });

                    input.resolve("1");
                }
            },
            {
                name: "all: can take an array of values: not a promise",
                exec: function(test){
                    var input = ["Value1", "Value2"];
                    var result = all(input);

                    test.assertTrue(result.every(function(val, idx){
                        return input[idx] === val;
                    }));

                    test.complete();
                }
            },
            {
                name: "all: can take an array of values: promise",
                exec: function(test){
                    var input = [new Deferred(), new Deferred()];
                    var result = all(input);

                    test.assertNotEqual(input, result, "Return does not match input");
                    test.assertIsFunction(result.then, "Return is a promise");

                    test.whenResolved(result, function(rtn){
                        test.assertEqual("1", rtn[0], "Resolution includes each promises resolution");
                        test.assertEqual("2", rtn[1], "Resolution includes each promises resolution");
                        test.complete();
                    });

                    input[0].resolve("1");
                    input[1].resolve("2");
                }
            },
            {
                name: "all: can take an array of values: mix-n-match promise",
                exec: function(test){
                    var input = [new Deferred(), "2", new Deferred()];
                    var result = all(input);

                    test.assertNotEqual(input, result, "Return does not match input");
                    test.assertIsFunction(result.then, "Return is a promise");

                    test.whenResolved(result, function(rtn){
                        test.assertEqual("1", rtn[0], "Resolution includes each promises resolution");
                        test.assertEqual("2", rtn[1], "Resolution includes each promises resolution");
                        test.assertEqual("3", rtn[2], "Resolution includes each promises resolution");
                        test.complete();
                    });

                    input[0].resolve("1");
                    input[2].resolve("3");
                }
            },
            {
                name: "all: reject on any will reject all",
                exec: function(test){
                    var input = [new Deferred(), "2", new Deferred()];
                    var result = all(input);

                    test.assertNotEqual(input, result, "Return does not match input");
                    test.assertIsFunction(result.then, "Return is a promise");

                    test.whenRejected(result, function(rtn){
                        test.assertEqual("err", rtn, "Rejected value is returned");

                        test.complete();
                    });

                    input[0].resolve("1");
                    input[2].reject("err");
                }
            }
        ]
    });
});