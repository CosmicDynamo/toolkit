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
 * @module core.observable.Source
 */
define([
    "dojo/_base/declare",
    "blocks/_Disposable",
    "blocks/genId",
    "./Subscription"
], function (declare, _Disposable, genId, Subscription) {
    /**
     * Object that serves as a starting point for Observable API events
     * @class core.observable.Source
     * @mixes blocks._Disposable
     */
    return declare([_Disposable], {
        /**
         * If true this Event source will persist even if there are no subscribers
         * @type {Boolean}
         * */
        hot: false,
        /**
         * If true this Event source will persist even if an error is received
         * @type {Boolean}
         * */
        sturdy: false,
        /**
         * List of all of the observables subscribed to this Event Source
         * @type {core.observable.Subscription[]}
         */
        _subscribers: null,
        constructor: function(){
            this._subscribers = {};
        },
        /**
         * Registers an endpoint as a subscriber to this observable
         * @param {core.observable.EndPoint} endPoint
         * @protected
         */
        _subscribe: function(endPoint){
            new Subscription({
                observable: this,
                observer: endPoint
            });
            return endPoint;
        },
        next: function(value){
            if (this.warnDisposed("Cannot fire next on disposed Event Source")){
                return;
            }

            if (!this.onNext) {
                this._fire("next", value);
            }

            this.inherited(arguments);
        },
        complete: function(){
            if (!this.onComplete) {
                this._fire("complete");
                this.dispose();
            }

            this.inherited(arguments);
        },
        error: function(value){
            if (!this.onError) {
                this._fire("error", value);
                if (!this.sturdy) {
                    this.dispose();
                }
            }

            this.inherited(arguments);
        },
        _fire: function(name, value){
            if (this.warnDisposed("Cannot fire " + name + " event on disposed Event Source")){
                return;
            }

            var subscribers = this._subscribers;
            Object.keys(subscribers).forEach(function(id){
                subscribers[id].fireEvent(name, value)
            });
        },
        /**
         * Registers a new Subscriber with this Event Source
         * @param {core.observable.Subscription} subscription
         * @reurn {String} The Id of the subscription used for disposal purposes
         * @protected
         */
        _addSubscriber: function(subscription){
            if (this.warnDisposed("Cannot subscribe to a disposed event source")){
                return;
            }

            var id = genId();
            this._subscribers[id] = subscription;
            return id;
        },
        /**
         * Removes a subscription from this Event Source
         * @description This method should be called by the subscription itself so I will assume, for now, that the
         * subscription is already being disposed
         * @param id
         * @private
         */
        _removeSubscriber: function(id){
            var subscribers = this._subscribers;
            delete subscribers[id];
            if (this.hot){
                return;
            }

            if (Object.keys(subscribers).length == 0){
                this.dispose();
            }
        },
        /**
         * Called when this even source is no longer needed
         */
        dispose: function(){
            this.inherited(arguments);

            var subscribers = this._subscribers;
            this._subscribers = {};
            Object.keys(subscribers).forEach(function(id){
                subscribers[id].dispose();
            });
        }
    });
});