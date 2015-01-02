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
 * @module jazzHands.query.Graph
 */
define([
    "dojo/_base/declare",
    "dojo/Stateful"
], function (declare, Stateful) {
    /**
     * @class jazzHands.query.Graph
     * @mixes dojo._base.declare
     */
    return declare([Stateful], {
        /** @property {String|String[]} Target Graph Names */
        target: null,
        /** @property {RdfJs.TripleStore} - The store being manipulated */
        tripleStore: null,
        /**
         * Adds a Triple to the target Graph
         * @param {RdfJs.Triple} triple - The triple being added
         */
        add: function (triple) {
            this.tripleStore.add(triple, this.target);
        },
        /**
         * Removes a Triple from the target Graph
         * @param {RdfJs.Triple} triple - The triple being added
         */
        remove: function (triple) {
            this.tripleStore.remove(triple, this.target);
        },
        /**
         * Remove any matching Triples from the target Graph
         * @param {String} [subject] - The subject being matched
         * @param {String} [predicate] - The subject being matched
         * @param {String} [object] - The subject being matched
         */
        removeMatches: function (subject, predicate, object) {
            this.tripleStore.removeMatches(subject, predicate, object, this.target);
        },
        /**
         * Returns an array containing the triples from the target Graph(S)
         * @return {RdfJs.Triple[]}
         */
        toArray: function () {
            return this.tripleStore.toArray(this.target);
        },
        /**
         * Returns true if some of the Triples pass the TripleFilter
         * @param {RdfJs._TripleFilter} tFilter - filter being executed
         * @return {Boolean}
         */
        some: function (tFilter) {
            return this.tripleStore.some(tFilter, this.target);
        },
        /**
         * Returns true if every Triple passes the TripleFilter
         * @param {RdfJs._TripleFilter} tFilter - filter being executed
         * @return {Boolean}
         */
        every: function (tFilter) {
            return this.tripleStore.every(tFilter, this.target);
        },
        /**
         * Returns the Triples which pass the TripleFilter
         * @param {RdfJs._TripleFilter} tFilter - filter being executed
         * @return {RdfJs.Graph}
         */
        filter: function (tFilter) {
            return this.tripleStore.filter(tFilter, this.target);
        },
        /**
         * Runs the TripleCallback against all Triples in the target Graph(s)
         * @param {RdfJs._TripleCallback} tCallback - callback being executed
         */
        forEach: function (tCallback) {
            this.tripleStore.forEach(tCallback, this.target);
        },
        /**
         * Returns any matching Triples from the target Graph(s)
         * @param {String} [subject] - The subject being matched
         * @param {String} [predicate] - The subject being matched
         * @param {String} [object] - The subject being matched
         * @return {RdfJs.Graph}
         */
        match: function (subject, predicate, object) {
            return this.tripleStore.match(subject, predicate, object, this.target);
        },
        /**
         * Adds all Triples from the Graph into the target Graph(s)
         * @param {RdfJs.Graph} data - The Graph data being added to this Graph
         */
        addAll: function (data) {
            this.tripleStore.addAll(data, this.target);
        }
    });
});