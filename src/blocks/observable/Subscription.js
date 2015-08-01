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
 * @module core.observable.Subscription
 */
define([
    "dojo/_base/declare",
    "blocks/_Disposable"
], function (declare, _Disposable) {
    /**
     * @class core.observable.Subscription
     * @mixes blocks._Disposable
     */
    return declare([_Disposable], {
        /**
         * The source of events being passed through
         * @type {core.observable.Source}
         */
        observer:null,
        /**
         * The Id to use when unsubscribing the Evet Listener
         * @type {String}
         */
        _observerId:null,
        /**
         * The receiver of any events being passed through
         * @type {core.observable.EndPoint}
         */
        observed:null,
        /**
         * The Id to use when unsubscribing the from the Event Source
         * @type {String}
         */
        _observedId:null,
        constructor: function(args){
            var observed = args.observable;
            var observer = args.observer;

            this._observerId = observer._addSubscription(this);
            this._observedId = observed._addSubscriber(this);

            this.observed = observed;
            this.observer = observer;
        },
        /**
         * kills this subscription
         */
        unsubscribe: function(){
            this.dispose();
        },
        /**
         * kills this subscription
         */
        dispose: function(){
            if (this.observer){
                this.observer._removeSubscription(this._observerId);
                this.observer = null;
            }

            if (this.observed){
                this.observed._removeSubscriber(this._observedId);
                this.observed = null;
            }
        },
        /**
         * Used to pass an event from the observed to the observer
         * @param {String} name - The event type that was fired, 'next', 'complete', or 'error'
         * @param {*} [value] - Data to be passed with a next or error event
         */
        fireEvent: function(name, value){
            if (this.warnDisposed('Event fired into a disposed subscription')) {
                return;
            }

            this.observer[name](value);
            if (!this.observed || !this.observer){
                //A subscription is not valid without both sides, so dispose it
                this.dispose();
            }
        }
    });
});