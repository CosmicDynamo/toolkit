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
 * @module core.observable.EndPoint
 */
define([
    "dojo/_base/declare",
    "blocks/_Disposable",
    "blocks/genId"
], function (declare, _Disposable, genId) {
    /**
     * @class core.observable.EndPoint
     * @mixes blocks._Disposable
     */
    return declare([_Disposable], {
        /**
         * List of Event sources this EndPoint listens to
         * @type {core.observable.Subscription}
         */
        _subscriptions: null,
        /**
         * The current counter on Next events
         * @type {number}
         */
        itrIdx: 0,
        constructor: function(args){
            this._subscriptions = {};

            args = args || {};
            if (args.onNext){
                this.onNext = args.onNext;
            }

            if (args.onComplete){
                this.onComplete = args.onComplete;
            }

            if (args.onError){
                this.onError = args.onError;
            }
        },
        next: function(value){
            if (this.warnDisposed("End Point already disposed")){
                return;
            }

            if (this.onNext) {
                this.onNext(value, this.itrIdx++, this);
            }

            this.inherited(arguments);
        },
        complete: function(){
            if (this.warnDisposed("End Point already disposed")){
                return;
            }

            if (this.onComplete) {
                this.onComplete(this);
            }

            this.inherited(arguments);
        },
        error: function(value){
            if (this.warnDisposed("End Point already disposed")){
                return;
            }

            if (this.onError) {
                this.onError(value, this);
            }

            this.inherited(arguments);
        },
        /**
         * Registers a new Subscription with this Event Source
         * @param {core.observable.Subscription} subscription
         * @reurn {String} The Id of the subscription used for disposal purposes
         * @protected
         */
        _addSubscription: function(subscription){
            if (this.warnDisposed("End Point already disposed, cannot add a new subscription")){
                return;
            }

            var id = genId();
            this._subscriptions[id] = subscription;
            return id;
        },
        /**
         * Removes a subscription from this Event Source
         * @description This method should be called by the subscription itself so I will assume, for now, that the
         * subscription is already being disposed
         * @param id
         * @private
         */
        _removeSubscription: function(id){
            var subscriptions = this._subscriptions;
            delete subscriptions[id];

            if (Object.keys(subscriptions).length == 0){
                this.dispose();
            }
        },
        /**
         * Called when this even source is no longer needed
         */
        dispose: function(){
            this.inherited(arguments);

            var subscriptions = this._subscriptions;
            this._subscriptions = {};
            Object.keys(subscriptions).forEach(function(id){
                subscriptions[id].dispose();
            });
        }
    });
});