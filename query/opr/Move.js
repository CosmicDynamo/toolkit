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
 * @module jazzHands.query.opr.Move
 */
define([
    "dojo/_base/declare",
    "dojo/Stateful"
], function (declare, Stateful) {
    /**
     * @class jazzHands.query.opr.Move
     * @implements jazzHands._QueryPlan
     */
    return declare([Stateful], {
        /** @property {jazzHands.query.Graph} */
        source: null,
        /** @property {jazzHands.query.Graph} */
        destination: null,
        /**
         * @override
         */
        execute: function () {
            //Clear Destination Graph
            this.destination.removeMatches(null, null, null);
            //Move Triples From Source To Destination
            this.destination.addAll(this.source);
            //Drop Source
            this.store.removeGraph(this.source.target);
        }
    });
});