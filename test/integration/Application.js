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
 * @module class.test.integration.Application
 */
define([
    "qasht/package/Unit",
    "service/Application",
    "dojo/_base/Deferred"
], function (TestPackage, Application, Deferred) {
    return new TestPackage({
        module: "service/Application",
        tests: [
            {
                name: "start: router is taken through lifecycle",
                setUp: function (test) {
                    var order = 1;
                    test.run = {};
                    test.def = {
                        loadConfig: new Deferred(),
                        init: new Deferred(),
                        start: new Deferred()
                    };
                    test.app.router.loadConfig = function () {
                        test.run.loadConfig = order++;
                        return test.def.loadConfig;
                    };
                    test.app.router.init = function () {
                        test.run.init = order++;
                        return test.def.init;
                    };
                    test.app.router.start = function () {
                        test.run.start = order++;
                        return test.def.start;
                    };
                    //test.app.router.shutdown = function(){
                    //    test.run.shutdown = order++;
                    //}
                },
                exec: function (test) {
                    test.app.start();

                    test.assertEqual(1, test.run.loadConfig, "loadConfig was run 1st");
                    test.assertUndefined(test.run.init, "init was not run");
                    test.assertUndefined(test.run.start, "start was not run");

                    //Resolve out of order to verify lifecycle respects promises
                    test.def.start.resolve();
                    test.def.init.resolve();
                    test.def.loadConfig.resolve();

                    test.assertEqual(1, test.run.loadConfig, "loadConfig was run 1st");
                    test.assertEqual(2, test.run.init, "init was run 2nd");
                    test.assertEqual(3, test.run.start, "start  was run 3rd");
                    //test.assertUndefined(test.run.shutdown, "shutdown was not run");

                    //test.app.shutdown();

                    //test.assertEqual(4, test.run.shutdown, "shutdown run");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.app = new Application();
        }
    });
});