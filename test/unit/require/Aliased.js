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
 * @module blocks.test.unit.require.Aliased
 */
define([
    "qasht/package/Unit",
    "blocks/require/Aliased"
], function (TestPackage, Aliased) {
    return new TestPackage({
        module: "blocks/require/Aliased",
        tests: [
            {
                name: "register: Adds a available aliased module",
                exec: function(test){
                    var out = test.require.load("LateLoad");

                    test.assertUndefined(out);

                    test.require.register("LateLoad", "blocks/test/unit/resources/loadMe");

                    test.whenResolved(test.require.load("LateLoad"), function(Ctor){
                        var inst = Ctor();
                        test.assertEqual("pass", inst.status);

                        test.complete();
                    });
                }
            },
            {
                name: "require: callback fn called which module(s) are loaded",
                exec: function(test){
                    return test.require.load("Exists", function(Ctor){
                        var inst = Ctor();
                        test.assertEqual("pass", inst.status);

                        test.complete();
                    });
                }
            },
            {
                name: "require: errback fn called when AND modules fail to load",
                exec: function(test){
                    test.whenRejected(test.require.load("BadMid"), function(err){
                        test.assertIsObject(err);

                        test.complete();
                    });
                }
            },
            {
                name: "require: returns promise resolved when module loads",
                exec: function(test){
                    test.whenResolved(test.require.load("Exists"), function(Ctor){
                        var inst = Ctor();
                        test.assertEqual("pass", inst.status);

                        test.complete();
                    });
                }
            }
        ],
        setUp: function (test) {
            test.require = new Aliased();

            test.require.register("Exists", "blocks/test/unit/resources/loadMe");
            test.require.register("BadMid", "bad/mid");
        }
    });
});