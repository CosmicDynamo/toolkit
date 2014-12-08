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
 * @module core.test.unit.app._Component
 */
define([
    "qasht/package/Unit",
    "core/app/_Component",
    "core/app/cache"
], function (TestPackage, _Component, cache) {
    return new TestPackage({
        module: "core/app/_Component",
        tests: [
            {
                name: "app: returns the current application",
                setUp: function (test) {
                    return cache.create("core/test/unit/app/resource/App");
                },
                exec: function (test) {
                    var cmp = new _Component();

                    test.assertEqual(cache.get(), cmp.app());

                    test.complete();
                }
            },
            {
                name: "Ctor: args are placed on object",
                exec: function(test){
                    var args = {
                        one:"value",
                        two: { "is": "object"}
                    };
                    var cmp = new _Component(args);

                    test.assertEqual(args.one, cmp.one);
                    test.assertEqual(args.two, cmp.two);

                    test.complete();

                }
            }
        ],
        setUp: function (test) {
        },
        tearDown: function (test) {
        }
    });
});