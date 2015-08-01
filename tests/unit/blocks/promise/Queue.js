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
 * @module blocks.test.unit.promise.Queue
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/promise/Queue",
    "dojo/_base/Deferred",
    "blocks/promise/when"
], function (TestSuite, assert, Queue, Deferred, when) {
    return new TestSuite({
        name: "blocks/promise/Queue",
        "enqueue: executes first queued fn sync": function(){
            var scope = {};
            var queue = new Queue(scope);

            queue.enqueue(function(){
                this.value = true;
            });

            assert.isTrue(scope.value, "Context was updated");
        },
        "enqueue: function execution context matches constructor param": function () {
            var scope = {};
            var queue = new Queue(scope);

            queue.enqueue(function(){
                this.value = true;
            });

            assert.isTrue(scope.value, "Context was updated");
        },
        "enqueue: executes each function in the order it was queue: no promise": function () {
            var scope = {order:0};
            var queue = new Queue(scope);

            queue.enqueue(function(){
                assert.strictEqual(0, this.order++, "1st function");
            });

            queue.enqueue(function(){
                assert.strictEqual(1, this.order++, "2nd function");
            });

            assert.strictEqual(2, scope.order);
        },
        "enqueue: executes each function in the order it was queue: promise": function () {
            var scope = {
                order:0,
                "0":new Deferred(),
                "1":new Deferred()
            };
            var queue = new Queue(scope);

            queue.enqueue(function(){
                assert.strictEqual(0, this.order++, "1st function");
                return this["0"];
            });

            queue.enqueue(function(){
                assert.strictEqual(1, this.order++, "2nd function");
                return this["1"];
            });

            var last = queue.enqueue(function(){
                assert.strictEqual(2, this.order++, "2nd function");
            });

            assert.strictEqual(1, scope.order);
            scope["1"].resolve(1);
            assert.strictEqual(1, scope.order);

            var done = this.async();
            when(last, done.callback(function(){
                assert.strictEqual(3, scope.order);
            }));

            scope["0"].resolve();
        },
        "enqueue: if args not specified; last return passed into next function: no promise": function () {
            var scope = {order:0};
            var queue = new Queue(scope);

            queue.enqueue(function(){
                return 1
            });

            var rtn = queue.enqueue(function(last){
                return last + 1;
            });

            assert.strictEqual(2, rtn);
        },
        "enqueue: if args not specified; last return passed into next function: promise": function () {
            var scope = {
                "0":new Deferred(),
                "1":new Deferred()
            };
            var queue = new Queue(scope);

            queue.enqueue(function(){
                return this["0"];
            });

            queue.enqueue(function(val){
                assert.strictEqual(1, val, "2nd function");
                return this["1"];
            });

            var last = queue.enqueue(function(val){
                assert.strictEqual(2, val, "2nd function");
                return val + 1;
            });

            var done = this.async();
            when(last, done.callback(function(val){
                assert.strictEqual(3, val);
            }));

            scope["1"].resolve(2);
            scope["0"].resolve(1);
        },
        "enqueue: arges are passed into enqueued fn: no promise": function () {
            var scope = {order:0};
            var queue = new Queue(scope);

            queue.enqueue(function(p1, p2){
                assert.strictEqual("1", p1);
                assert.strictEqual("2", p2);
                return "Error"
            }, ["1", "2"]);

            queue.enqueue(function(p1, p2){
                assert.strictEqual("3", p1);
                assert.strictEqual("4", p2);
            }, ["3", "4"]);
        },
        "enqueue: args are passed into enqueued fn: promise": function () {
            var scope = {
                "0":new Deferred(),
                "1":new Deferred()
            };
            var queue = new Queue(scope);

            queue.enqueue(function(p1, p2){
                assert.strictEqual("1", p1);
                assert.strictEqual("2", p2);
                return this["0"];
            }, ["1", "2"]);

            queue.enqueue(function(p1, p2){
                assert.strictEqual("3", p1);
                assert.strictEqual("4", p2);
                return this["1"];
            }, ["3", "4"]);

            var last = queue.enqueue(function(p1, p2){
                assert.strictEqual("5", p1);
                assert.strictEqual("6", p2);
                return "done";
            }, ["5", "6"]);

            var done = this.async();
            when(last, done.callback(function(p1){
                assert.strictEqual("done", p1);
            }));

            scope["1"].resolve("fail");
            scope["0"].resolve("fail");
        },
        "enqueue: queue can be stopped in the event of an error: return promise rejected": function () {
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
                assert.ok(false, "This function should not be executed");
            });

            var done = this.async();
            when(last, function(){
                assert.fail(null, null, "Promise should have been rejected")
            }, done.callback(function(p1){
                assert.strictEqual("pass", p1);
            }));

            scope["1"].reject("pass");
            scope["0"].resolve("fail");
        },
        "onError: constructor errBack fn will prevent queue stopped": function () {
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

            var done = this.async();
            when(last, done.callback(function(){
                assert.isTrue(scope.err, "Error fn was called");
                assert.isTrue(scope.lastRun, "Last fn was called");
            }));

            scope["1"].reject("pass");
            scope["0"].resolve("fail");
        }
    });
});