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
 * @module blocks.test.unit.promise.Queue
 */
define([
    "qasht/package/Unit",
    "blocks/promise/Queue",
    "dojo/_base/Deferred"
], function (TestPackage, Queue, Deferred) {
    return new TestPackage({
        module: "blocks/promise/Queue",
        tests: [
            {
                name: "enqueue: executes first queued fn sync",
                exec: function(test){
                    var scope = {};
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        this.value = true;
                    });

                    test.assertTrue(scope.value, "Context was updated");

                    test.complete();
                }
            },
            {
                name: "enqueue: function execution context matches constructor param",
                exec: function (test) {
                    var scope = {};
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        this.value = true;
                    });

                    test.assertTrue(scope.value, "Context was updated");

                    test.complete();
                }
            },
            {
                name: "enqueue: executes each function in the order it was queue: no promise",
                exec: function (test) {
                    var scope = {order:0};
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        test.assertEqual(0, this.order++, "1st function");
                    });

                    queue.enqueue(function(){
                        test.assertEqual(1, this.order++, "2nd function");
                    });

                    test.assertEqual(2, scope.order);

                    test.complete();
                }
            },
            {
                name: "enqueue: executes each function in the order it was queue: promise",
                exec: function (test) {
                    var scope = {
                        order:0,
                        "0":new Deferred(),
                        "1":new Deferred()
                    };
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        test.assertEqual(0, this.order++, "1st function");
                        return this["0"];
                    });

                    queue.enqueue(function(){
                        test.assertEqual(1, this.order++, "2nd function");
                        return this["1"];
                    });

                    var last = queue.enqueue(function(){
                        test.assertEqual(2, this.order++, "2nd function");
                    });

                    test.assertEqual(1, scope.order);
                    scope["1"].resolve(1);
                    test.assertEqual(1, scope.order);

                    test.whenResolved(last, function(){
                        test.assertEqual(3, scope.order);

                        test.complete();
                    });

                    scope["0"].resolve();
                }
            },
            {
                name: "enqueue: if args not specified; last return passed into next function: no promise",
                exec: function (test) {
                    var scope = {order:0};
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        return 1
                    });

                    var rtn = queue.enqueue(function(last){
                        return last + 1;
                    });

                    test.assertEqual(2, rtn);

                    test.complete();
                }
            },
            {
                name: "enqueue: if args not specified; last return passed into next function: promise",
                exec: function (test) {
                    var scope = {
                        "0":new Deferred(),
                        "1":new Deferred()
                    };
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        return this["0"];
                    });

                    queue.enqueue(function(val){
                        test.assertEqual(1, val, "2nd function");
                        return this["1"];
                    });

                    var last = queue.enqueue(function(val){
                        test.assertEqual(2, val, "2nd function");
                        return val + 1;
                    });

                    test.whenResolved(last, function(val){
                        test.assertEqual(3, val);

                        test.complete();
                    });

                    scope["1"].resolve(2);
                    scope["0"].resolve(1);
                }
            },
            {
                name: "enqueue: arges are passed into enqueued fn: no promise",
                exec: function (test) {
                    var scope = {order:0};
                    var queue = new Queue(scope);

                    queue.enqueue(function(p1, p2){
                        test.assertEqual("1", p1);
                        test.assertEqual("2", p2);
                        return "Error"
                    }, ["1", "2"]);

                    queue.enqueue(function(p1, p2){
                        test.assertEqual("3", p1);
                        test.assertEqual("4", p2);
                    }, ["3", "4"]);

                    test.complete();
                }
            },
            {
                name: "enqueue: args are passed into enqueued fn: promise",
                exec: function (test) {
                    var scope = {
                        "0":new Deferred(),
                        "1":new Deferred()
                    };
                    var queue = new Queue(scope);

                    queue.enqueue(function(p1, p2){
                        test.assertEqual("1", p1);
                        test.assertEqual("2", p2);
                        return this["0"];
                    }, ["1", "2"]);

                    queue.enqueue(function(p1, p2){
                        test.assertEqual("3", p1);
                        test.assertEqual("4", p2);
                        return this["1"];
                    }, ["3", "4"]);

                    var last = queue.enqueue(function(p1, p2){
                        test.assertEqual("5", p1);
                        test.assertEqual("6", p2);
                        return "done";
                    }, ["5", "6"]);

                    test.whenResolved(last, function(p1){
                        test.assertEqual("done", p1);

                        test.complete();
                    });

                    scope["1"].resolve("fail");
                    scope["0"].resolve("fail");
                }
            },
            {
                name: "enqueue: queue can be stopped in the event of an error: return promise rejected",
                exec: function (test) {
                    var scope = {
                        "0":new Deferred(),
                        "1":new Deferred()
                    };
                    var queue = new Queue(scope);

                    queue.enqueue(function(){
                        return this["0"];
                    });
                    queue.enqueue(function(){
                        return this["1"];
                    });

                    var last = queue.enqueue(function() {
                        test.assertFail("This function should not be executed");
                    });

                    test.whenRejected(last, function(p1){
                        test.assertEqual("pass", p1);

                        test.complete();
                    });

                    scope["1"].reject("pass");
                    scope["0"].resolve("fail");
                }
            },
            {
                name: "onError: constructor errBack fn will prevent queue stopped",
                exec: function (test) {
                    var scope = {
                        "0": new Deferred(),
                        "1": new Deferred()
                    };
                    var queue = new Queue(scope, function () {
                        scope.err = true;
                    });

                    queue.enqueue(function () {
                        return this["0"];
                    });

                    queue.enqueue(function () {
                        return this["1"];
                    });

                    var last = queue.enqueue(function () {
                        this.lastRun = true;
                    });

                    test.whenResolved(last, function () {
                        test.assertTrue(scope.err, "Error fn was called");
                        test.assertTrue(scope.lastRun, "Last fn was called");

                        test.complete();
                    });

                    scope["1"].reject("pass");
                    scope["0"].resolve("fail");

                }
            }
        ],
        setUp: function (test) {
        },
        tearDown: function (test) {
        }
    });
});