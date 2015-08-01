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
 * @module tests.unit.blocks.require
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/require"
], function (registerSuite, assert, require) {
    return registerSuite({
        "require: callback fn called which module(s) are loaded": function(){
            var async = this.async();

            require([
                "tests/unit/blocks/resources/loadMe",
                "tests/unit/blocks/resources/loadMe"
            ], async.callback(function(m1, m2){
                assert.strictEqual(m1, m2);
                var inst = m1();
                assert.strictEqual("pass", inst.status);
            }));
        },
        "require: errback fn called when AND modules fail to load": function(){
            var async = this.async();

            require([
                "bad/mid",
                "different/bad/mid"
            ], function(){
                async.reject("Callback Function should not be called")
            }, async.callback(function(err){
                test.assert.isObject(err);
            }));

        }
    });
    return new TestPackage({
        module: "blocks/require",
        tests: [
            {
                name: "require: errback fn called when AND modules fail to load",
                exec: function(test){
                    require([
                        "bad/mid",
                        "different/bad/mid"
                    ], function(){
                        test.assertFail("Callback Function should not be called")
                    }, function(err){
                        assert.isObject(err);

                        test.complete();
                    });
                }
            },
            {
                name: "require: errback fn called when AND modules fail to load",
                exec: function(test){
                    require([
                        "bad/mid/repeat/errback"
                    ], function(){
                        test.assertFail("Callback Function should not be called")
                    }, function(err1){
                        assert.isObject(err1);

                        require([
                            "bad/mid/repeat/errback"
                        ], function(){
                            test.assertFail("Callback Function should not be called")
                        }, function(err2){
                            assert.isObject(err2);

                            test.complete();
                        });
                    });
                }
            },
            {
                name: "require: returns promise resolved when module loads",
                exec: function(test){
                    test.whenResolved(require([
                        "tests/unit/blocks/resources/loadMe",
                        "tests/unit/blocks/resources/loadMe"
                    ]), function(args){
                        var m1 = args[0];
                        var m2 = args[1];
                        test.assertEqual(m1, m2);
                        var inst = m1();
                        test.assertEqual("pass", inst.status);

                        test.complete();
                    });

                }
            },
            {
                name: "require: return promise rejected if ANY module fails",
                exec: function(test){
                    test.whenRejected(require([
                        "bad/mid",
                        "different/bad/mid"
                    ]), function(err){
                        assert.isObject(err);

                        test.complete();
                    });
                }
            },
            {
                name: "require: If mid has already been rejected, it will still fail promise",
                exec: function(test){
                    test.whenRejected(require([
                        "bad/repeat/mid"
                    ]), function(err1){
                        assert.isObject(err1);
                        test.whenRejected(require([
                            "bad/repeat/mid"
                        ]), function(err2){
                            assert.isObject(err2);
                            test.assertEqual(err1, err2);

                            test.complete();
                        });
                    });
                }
            }
        ]
    });
});