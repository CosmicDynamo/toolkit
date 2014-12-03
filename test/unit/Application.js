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
 * @module core.test.unit.Application
 */
define([
    "qasht/package/Unit",
    "core/Application",
    "dojo/_base/Deferred"
], function (TestPackage, Application, Deferred) {
    return new TestPackage({
        module: "core/Application",
        tests: [
            {
                name: "start: takes app components through life-cycle",
                setUp: function (test) {
                    test.app.test = {
                        order: 0,
                        loadConfig: function () {
                            this.__loadConfig = ++this.order;
                        },
                        init: function () {
                            this.__init = ++this.order;
                        },
                        start: function () {
                            this.__start = ++this.order;
                        }
                    };
                    test.app.components.push("test");
                },
                exec: function (test) {
                    var inst = test.app.start();

                    test.assertEqual(1, inst.test.__loadConfig);
                    test.assertEqual(2, inst.test.__init);
                    test.assertEqual(3, inst.test.__start);

                    test.complete();
                }
            },
            {
                name: "start: component not in list does not experience life-cycle",
                setUp: function (test) {
                    test.app.test = {
                        order: 0,
                        __loadConfig:-1,
                        __init:-1,
                        __start:-1,
                        loadConfig: function () {
                            this.__loadConfig = ++this.order;
                        },
                        init: function () {
                            this.__init = ++this.order;
                        },
                        start: function () {
                            this.__start = ++this.order;
                        }
                    };
                },
                exec: function (test) {
                    var inst = test.app.start();

                    test.assertEqual(-1, inst.test.__loadConfig);
                    test.assertEqual(-1, inst.test.__init);
                    test.assertEqual(-1, inst.test.__start);

                    test.complete();
                }
            },
            {
                name: "start: handles promise return",
                setUp: function (test) {
                    test.app.test = {
                        order: 0,
                        __loadConfig:-1,
                        __init:-1,
                        __start:-1,
                        __loadPromise: new Deferred(),
                        __initPromise: new Deferred(),
                        __startPromise: new Deferred(),
                        loadConfig: function () {
                            this.__loadConfig = ++this.order;
                            return this.__loadPromise;
                        },
                        init: function () {
                            this.__init = ++this.order;
                            return this.__initPromise;
                        },
                        start: function () {
                            this.__start = ++this.order;
                            return this.__startPromise;
                        }
                    };
                    test.app.components.push("test");
                },
                exec: function (test) {
                    var ready = test.app.start();

                    test.assertEqual(1, test.app.test.__loadConfig);
                    test.assertEqual(-1, test.app.test.__init);
                    test.assertEqual(-1, test.app.test.__start);

                    test.app.test.__loadPromise.resolve();

                    test.assertEqual(1, test.app.test.__loadConfig);
                    test.assertEqual(2, test.app.test.__init);
                    test.assertEqual(-1, test.app.test.__start);

                    test.app.test.__initPromise.resolve();

                    test.assertEqual(1, test.app.test.__loadConfig);
                    test.assertEqual(2, test.app.test.__init);
                    test.assertEqual(3, test.app.test.__start);

                    test.app.test.__startPromise.resolve();

                    test.whenResolved(ready, function(app){
                        test.assertEqual(1, app.test.__loadConfig);
                        test.assertEqual(2, app.test.__init);
                        test.assertEqual(3, app.test.__start);

                        test.complete();
                    });
                }
            }
        ],
        setUp: function (test) {
            test.app = new Application({});
        }/*,
        tearDown: function (test) {
            test.app.shutdown();
        }*/
    });
});