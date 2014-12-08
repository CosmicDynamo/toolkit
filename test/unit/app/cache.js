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
 * @module core.test.unit.app.cache
 */
define([
    "qasht/package/Unit",
    "core/app/cache"
], function (TestPackage, cache) {
    return new TestPackage({
        module: "core/app/cache",
        tests: [
            {
                name: "API",
                exec: function (test) {
                    test.assertIsObject(cache, "Cache is an instance module");
                    test.assertIsFunction(cache.get, "Cache has a get method");
                    test.assertIsFunction(cache.create, "Cache has a method to create new applications");

                    test.complete();
                }
            },
            {
                name: "create: will create and store an app of your choosing",
                exec: function(test){
                    test.whenResolved(cache.create("core/test/unit/app/resource/App"), function(app){
                        test.assertIsObject(app, "App was instantiated");
                        test.assertEqual("pass", app.loaded);

                        test.complete();
                    });
                }
            },
            {
                name: "get: returns the most recent app",
                exec: function(test){
                    test.whenResolved(cache.create("core/test/unit/app/resource/App"), function(app){
                        test.assertIsObject(app, "App was instantiated");
                        test.assertEqual("pass", app.loaded);

                        test.assertEqual(app, cache.get());

                        test.complete();
                    });
                }
            }
        ]
    });
});