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
 *
 * Unauthorized distribution, adaptation or use may be subject to civil and criminal penalties.
 * @module tests.unit.blocks.Observable
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/Observable",
    "dojo/_base/Deferred",
    "polyfill/has!Function.next",
    "polyfill/has!Function.defer"
], function (intern, assert, Observable, Deferred) {
    return intern({
        name: "blocks/Observable",
        "onNext: Notified of event being fired": function () {
            var eventSource = new Observable();

            var message = null;
            eventSource.subscribe({
                onNext: function (value) {
                    message = value
                },
                onComplete: function () {
                    assert.fail(null, null, "onComplete should not be called");
                },
                onError: function () {
                    assert.fail(null, null, "onError should not be called");
                }
            });

            eventSource.next("Hello!!");

            assert.strictEqual("Hello!!", message, "Event was received");

            eventSource.dispose();
        },
        "onNext: Notified of multiple events being fired": function () {
            var eventSource = new Observable();

            var message = [];
            eventSource.subscribe({
                message: [],
                onNext: function (value) {
                    message.push(value);
                },
                onComplete: function () {
                    assert.fail(null, null, "onComplete should not be called");
                },
                onError: function () {
                    assert.fail(null, null, "onError should not be called");
                }
            });

            var events = "Hello!! This is a Test.".split(" ");

            events.forEach(function (text) {
                eventSource.next(text);
            });

            events.forEach(function (text, idx, array) {
                assert.strictEqual(array[idx], message[idx], "Event was received");
            });

            eventSource.dispose();
        },
        "onComplete: Notified of event being fired": function () {
            var eventSource = new Observable();

            var message = null;
            eventSource.subscribe({
                onNext: function () {
                    assert.fail(null, null, "onComplete should not be called");
                },
                onComplete: function () {
                    message = "Event Complete";
                },
                onError: function () {
                    assert.fail(null, null, "onError should not be called");
                }
            });

            eventSource.complete();

            assert.strictEqual("Event Complete", message, "Complete Event was received");
        },
        "onComplete: All event notifications stop after 1st call": function () {
            var eventSource = new Observable();

            var message = null;
            eventSource.subscribe({
                onNext: function () {
                    assert.fail(null, null, "onNext should not be called");
                },
                onComplete: function () {
                    if (message) {
                        assert.fail(null, null, "onComplete should only be called once");
                    }
                    message = "Event Complete";
                },
                onError: function () {
                    assert.fail(null, null, "onError should not be called");
                }
            });

            eventSource.complete();
            eventSource.next("fail");
            eventSource.error({ message: "fail"});
            eventSource.complete();

            assert.strictEqual("Event Complete", message, "Complete Event was received");
        },
        "onError: Notified of event being fired": function () {
            var eventSource = new Observable();

            var exception = null;
            eventSource.subscribe({
                onNext: function () {
                    assert.fail(null, null, "onComplete should not be called");
                },
                onComplete: function () {
                    assert.fail(null, null, "onComplete should not be called");
                },
                onError: function (error) {
                    exception = error;
                }
            });

            eventSource.error({ message: "Succeeded in Failing"});

            assert.strictEqual("Succeeded in Failing", exception.message, "Error Event was received");
        },
        "onError: All event notifications stop after 1st call": function () {
            var eventSource = new Observable();

            var exception = null;
            eventSource.subscribe({
                onNext: function () {
                    assert.fail(null, null, "onNext should not be called");
                },
                onComplete: function () {
                    assert.fail(null, null, "onComplete should not be called");
                },
                onError: function (error) {
                    if (exception) {
                        assert.fail(null, null, "onError should only be called once");
                    }
                    exception = error;
                }
            });

            eventSource.error({ message: "Succeeded in Failing"});
            eventSource.next("Fail");
            eventSource.complete();
            eventSource.error({message: "Should not be called again"});

            assert.strictEqual("Succeeded in Failing", exception.message, "Error Event was received");
        },
        "take: Listener will call onComplete after desired number of onNext calls": function () {
            var eventSource = new Observable();

            var take1 = 0;
            eventSource.take(1).subscribe({
                onNext: function () {
                    take1++;
                }
            });

            var take2 = 0;
            eventSource.take(2).subscribe({
                onNext: function () {
                    take2++;
                }
            });

            var takeTen = 0;
            eventSource.take(10).subscribe({
                taken: 0,
                onNext: function () {
                    takeTen++;
                }
            });

            for (var i = 0; i < 20; i++) {
                eventSource.next(i);
            }

            assert.strictEqual(take1, 1, "take(1) only fired onNext once");
            assert.strictEqual(take2, 2, "take(2) only fired onNext twice");
            assert.strictEqual(takeTen, 10, "take(10) fired onNext 10 times");

            eventSource.complete();
        },
        "takeUntil: Listener will call onComplete when onValue from input observable": function () {
            var eventSource = new Observable();
            var events = 0;
            var complete = false;

            var stop = new Observable();

            eventSource.takeUntil(stop).subscribe({
                onNext: function () {
                    events++;
                },
                onComplete: function () {
                    complete = true;
                }
            });

            for (var i = 1; i <= 20; i++) {
                eventSource.next(i);
                if (i === 10) {
                    stop.next(i);
                }
            }

            assert.strictEqual(10, events, "Only ten values were received");
            assert.isTrue(complete, "Observer was completed");
        },
        "mergeWith(Observable): returns an observable with the input merged with self": function () {
            var eventSource = new Observable();

            var observable = new Observable();
            var merged = eventSource.mergeWith(observable);

            var values = [];
            merged.subscribe({
                onNext: function (value) {
                    values.push(value);
                }
            });

            eventSource.next(0);
            observable.next(1);

            assert.strictEqual(values.length, 2);
            for (var idx = 0; idx < values.length; idx++) {
                assert.strictEqual(values[idx], idx);
            }
        },
        "mergeWith(Observable[]): returns an observable with the input merged with self": function () {
            var eventSource = new Observable();

            var observables = [];
            for (var idx = 0; idx < 10; idx++) {
                observables.push(new Observable());
            }
            var merged = eventSource.mergeWith(observables);

            var values = [];
            merged.subscribe({
                onNext: function (value) {
                    values.push(value);
                }
            });

            eventSource.next(0);
            observables.forEach(function (observable, idx) {
                observable.next(idx + 1)
            });

            assert.strictEqual(values.length, 11);
            for (idx = 0; idx < values.length; idx++) {
                assert.strictEqual(values[idx], idx);
            }
        },
        "mergeWith(Observable, Observable, ...): returns an observable with the input merged with self": function () {
            var eventSource = new Observable();

            var observables = [];
            for (var idx = 0; idx < 10; idx++) {
                observables.push(new Observable());
            }
            var list = observables;
            var merged = eventSource.mergeWith(list[0], list[1], list[2], list[3], list[4], list[5], list[6], list[7], list[8], list[9]);

            var values = [];
            merged.subscribe({
                onNext: function (value) {
                    values.push(value);
                }
            });

            eventSource.next(0);
            observables.forEach(function (observable, idx) {
                observable.next(idx + 1)
            });

            assert.strictEqual(11, values.length);
            for (idx = 0; idx < values.length; idx++) {
                assert.strictEqual(idx, values[idx]);
            }
        },
        "filter: forwards values which pass the provided filter function": function () {
            var eventSource = new Observable();

            var values = [];
            var complete = false;
            eventSource.filter(function (value) {
                return (value % 2) === 0;
            }).subscribe({
                onNext: function (value) {
                    values.push(value);
                },
                onComplete: function () {
                    complete = true;
                }
            });

            var idx;
            for (idx = 0; idx < 10; idx++) {
                eventSource.next(idx);
            }

            assert.strictEqual(5, values.length);
            for (idx = 0; idx < 5; idx++) {
                assert.strictEqual(values[idx], (idx * 2));
            }

            eventSource.complete(idx);
            assert.isTrue(complete, "onComplete was passed to observer");

            eventSource.next(2);
            assert.strictEqual(values.length, 5, "no new next events cal be received");
        },
        "map: applies a function to every item in the observable and returns a new observable with these transformations ": function() {
            var eventSource = new Observable();

            var values = [];
            eventSource.map(function(value) {
                return (value * value);
            }).subscribe({
                onNext: function(value) {
                    values.push(value);
                }
            });

            var i;
            for (i = 0; i < 10; i++) {
                eventSource.next(i);
            }

            assert.strictEqual(10, values.length, "Incorrect count of observer values.");

            for (i = 0; i < 10; i++) {
                assert.strictEqual(i*i, values[i], "Transformed values to match the values in the new observable.");
            }
        },
        "throttle: will suppress event that fire faster than the threshold": function () {
            var eventSource = new Observable();

            var done = this.async();
            var count = 0;
            var last = null;
            eventSource.throttle(50).subscribe({
                onNext: function (value) {
                    count++;
                    last = value;
                },
                onComplete: function(){
                    assert.strictEqual(1, count, "Only one event received");
                    assert.strictEqual(4, last, "Last event fired was received, before 1st promise resolved");

                    done.resolve();
                }
            });

            for (var idx = 0; idx < 5; idx++) {//Fire every 10ms for 50ms
                eventSource.next.next(eventSource, [idx], 10 * idx);
            }

            eventSource.complete.next(eventSource, [], 20 * idx);

            eventSource.next("first");
        },
        "throttle: will fire events which occur slower than the threshold": function () {
            var eventSource = new Observable();

            var done = this.async();
            var count = 0;
            var last = null;
            eventSource.throttle(100).subscribe({
                onNext: function (value) {
                    count++;
                    last = value;
                    if (count > 1){
                        eventSource.complete();
                    }
                },
                onComplete: function(){
                    assert.strictEqual(count, 2, "Only one event received");
                    assert.strictEqual(last, "second", "Last event fired was received, before 1st promise resolved");

                    done.resolve();
                }
            });

            for (var idx = 0; idx < 5; idx++) {//Fire every 10ms for 50ms
                eventSource.next.next(eventSource, [idx], 10 * idx);
            }

            eventSource.next("first");

            eventSource.next.next(eventSource, ["second"], 200);
        },
        "throttle: reset time for each event received": function () {
            var eventSource = new Observable();

            var done = this.async();
            var count = 0;
            var last = null;
            eventSource.throttle(100).subscribe({
                onNext: function (value) {
                    count++;
                    last = value;
                },
                onComplete: function(){
                    assert.strictEqual(count, 1, "Only one event received");
                    assert.strictEqual(last, 5, "Last event fired was received, before 1st promise resolved");

                    done.resolve();
                }
            });

            for (var idx = 0; idx < 6; idx++) { //Fire every 50ms for 300ms
                eventSource.next.next(eventSource, [idx], 50 * idx);
            }

            eventSource.next("first");
            eventSource.complete.next(eventSource, [], 100 * idx);
        },
        "throttle: complete interrupts any pending throttled events": function () {
            var eventSource = new Observable();

            var complete = false;
            eventSource.throttle(100).subscribe({
                onNext: function () {
                    assert.fail(null, null, "onNext should not be called")
                },
                onComplete: function () {
                    complete = true;
                }
            });

            eventSource.next("first");
            eventSource.complete();

            assert.isTrue(complete, "Complete has not been fired");
            return (function () {
                assert.isTrue(complete, "Complete was fired");
            }).defer(null, [], 200);
        },
        "map: for each event received will return the function return": function(){
            var eventSource = new Observable();

            var mapping = ['a', 'new', 'value', 'is', 'returned'];
            var events = 0;
            eventSource.map(function (value) {
                return mapping[value];
            }).forEach(function(value, idx){
                events++;
                assert.strictEqual(value, mapping[idx], "Mapped value was returned");
            });

            for(var idx = 0; idx < mapping.length; idx++){
                eventSource.next(idx);
            }
            assert.strictEqual(events, mapping.length, "All events were recieved");
        },
        "map: Promise returned will be subscribed to": function(){
            var eventSource = new Observable();

            var deferred = [new Deferred(), new Deferred(), new Deferred(),new Deferred(), new Deferred()];
            var mapping = ['a', 'new', 'value', 'is', 'returned'];
            var events = 0;
            eventSource.map(function (value) {
                return deferred[value];
            }).forEach(function(value, idx){
                events++;
                assert.strictEqual(value, mapping[mapping.length - 1 - idx], "Mapped value was returned");
            });
            var idx;
            for(idx = 0; idx < mapping.length; idx++){
                eventSource.next(idx);
            }

            for(idx = mapping.length - 1; idx >= 0; idx--){
                assert.strictEqual(events, mapping.length - 1 - idx, "Only events sent so far have been received");
                deferred[idx].resolve(mapping[idx]);
            }
            assert.strictEqual(events, mapping.length, "All events were recieved");
        },
        "map: Observable returned will be subscribed to": function () {
            var eventSource = new Observable();

            var values = [];
            var sources = {};
            var complete = false;
            eventSource.map(function (value) {
                return sources[value] = new Observable();
            }).subscribe({
                onNext: function (value) {
                    values.push(value);
                },
                onComplete: function () {
                    complete = true;
                }
            });

            eventSource.next(0);
            sources[0].next(0);
            eventSource.next(1);
            sources[0].next(0);
            sources[1].next(1);
            eventSource.next(2);
            sources[0].next(0);
            sources[1].next(1);
            sources[2].next(2);
            sources[2].complete();
            sources[0].next(0);
            sources[1].next(1);
            sources[1].complete();
            sources[0].next(0);
            sources[0].complete();

            //|0-0--0---0--0|
            //  |-1--1---1|
            //     |--2|
            //--------------
            //|0-01-012-01-0|

            assert.strictEqual(9, values.length, "Three events received");
            assert.strictEqual(0, values[0]);
            assert.strictEqual(0, values[1]);
            assert.strictEqual(1, values[2]);
            assert.strictEqual(0, values[3]);
            assert.strictEqual(1, values[4]);
            assert.strictEqual(2, values[5]);
            assert.strictEqual(0, values[6]);
            assert.strictEqual(1, values[7]);
            assert.strictEqual(0, values[8]);

            assert.isFalse(complete);

            eventSource.next(3);
            sources[3].next(3);
            sources[3].complete();
            eventSource.complete();

            assert.strictEqual(10, values.length, "Fourth Event received");
            assert.strictEqual(3, values[9]);
            assert.isTrue(complete);
        }
    });
});