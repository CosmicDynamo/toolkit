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
 * @module core.Observable
 */
define([
    "dojo/_base/declare",
    "./observable/Source",
    "./observable/EndPoint",
    "blocks/promise/when",
    "./typeTest",

    "polyfill/has!Function.next"
], function (declare, Source, EndPoint, when, typeTest) {
    /**
     * @class core.Observable
     * @mixes dojo.declare
     * @mixes core.observable.Source
     * @mixes core.observable.EndPoint
     */
    var Observable = declare([Source, EndPoint], {
        /**
         * Creates a new subscription to this Observable
         * @param {Object} options - The subscription details
         * @param {Function} [options.onNext] - Function that will be called on next events
         * @param {Function} [options.onComplete] - Function that will be called on complete events
         * @param {Function} [options.onError] - Function that will be called on error events
         */
        subscribe: function(options){
            this._subscribe(new EndPoint(options));
        },
        /**
         * Array Iterator function for subscribing to next events from this Observable
         * @param {Function} onNext
         */
        forEach: function(onNext){
            this.subscribe({
                onNext: onNext
            });
        },
        /**
         * Unsubscribes after the specified number of events have occured
         * @param {Number} count
         */
        take: function(count){
            return this._subscribe(new Observable({
                onNext: function(value, idx){
                    this._fire("next", value);
                    if ((idx + 1) >= count){
                        this.complete();
                    }
                }
            }));
        },
        /**
         * Will continue listening to events until an event is fired from the Event Source
         * @param {core.observable.Source | Promise} source
         */
        takeUntil: function(source){
            var self = this;
            var observer = new Observable();
            var done = function(){
                self.complete();
                if (this.dispose){
                    this.dispose();
                }
            };

            if (source.then){
                when(source, done, done);
            } else {
                source.subscribe({
                    onNext: done,
                    onComplete: done,
                    onError: done
                });
            }
            return this._subscribe(observer);
        },
        /**
         * @param {core.observable.Source[] || ...core.observable.Source} list
         */
        mergeWith: function(list){
            var observer = new Observable();
            observer.push(this);
            var sources = typeTest.isArray(list)?list:arguments;

            [].forEach.call(sources, function(source){
                observer.push(source);
            });

            return observer;
        },
        /**
         * Adds the input observable to the list of subscriptions
         * @param {core.Observable} observable
         */
        push: function(observable){
            observable._subscribe(this);
        },
        /**
         * Returns an Observable which only receives events which pass the filter function
         * @param {Function} fn - Function that returns true if an event should be passed on
         */
        filter: function(fn){
            return this._subscribe(new Observable({
                onNext: function(value){
                    if (fn(value)){
                        this._fire("next", value);
                    }
                }
            }));
        },
        /**
         * Runs events through the mapping function an passes the results to the output observable
         * @param {Function} fn
         */
        map: function(fn){
            return this._subscribe(new Observable({
                onNext: function(value){
                    var observable = this;
                    var next = function(value){
                        observable._fire('next', value)
                    };

                    var out = fn(value);
                    if (typeTest.isFunction(out.subscribe)){
                        out.subscribe({ onNext: next });
                    } else if (typeTest.isFunction(out.then)) {
                        when(out, next, function(err){
                            observable.onError(err);
                        });
                    } else {
                        next(out);
                    }
                }
            }));
        },
        /**
         * Ignores the values from an observable sequence which are followed by another value before input milliseconds have passed
         * @param {Number} ms
         */
        throttle: function(ms){
            var observable = new Observable();
            var fireEvent = function(value, idx){
                if (fireEvent.done || fireEvent.last != idx){
                    return;
                }

                observable._fire('next', value);
            };
            fireEvent.last = 0;
            observable.onNext = function(value){
                fireEvent.next(this, [value, ++fireEvent.last], ms)
            };
            observable.onComplete = function(){
                fireEvent.done = true;
                observable._fire("complete");
            };
            return this._subscribe(observable);
        }
    });
    return Observable;
});