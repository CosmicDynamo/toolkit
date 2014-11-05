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
 * @module service.io.Builder
 */
define([
    "../../dojo/_base/declare",
    "RdfJs/TripleStore",
    "RdfJs/Triple",
    "blocks/genId"
], function (declare, TripleStore, Triple, genId) {
    /**
     * @class  service.io.Builder
     */
    var Builder = declare([], {
        /** @property {RdfJs.TripleStore} */
        store: null,
        /** @property {RdfJs.Node} */
        subject: null,
        /** @property {String} */
        graphName: null,
        /** @property {Function} */
        Triple: null,
        constructor: function (args) {
            this.graphName = args.graphName || genId();
            this.Triple = args.TripleCtor || Triple;
            this.store = args.store || (new (args.StoreCtor || TripleStore)());

            this.subject = args.subject;
        },
        /**
         * Adds an Exception to the current response
         * @param {Number} errorCode
         * @param {String} [details]
         */
        exception: function (errorCode, details) {
            //TODO: lookup exception by code
            var err = this.addObject(errorCode)
                .addType("http://cosmicdynamo.net/vocab/exception.owl#Exception");
            if (details) {
                err.setValue("<urn:details>", "'" + details + "'");
            }
            return err;
        },
        /**
         * Returns a builder for updating the provided object's IRI
         * @param {String} subject
         * @return {service.Builder}
         */
        addObject: function (subject) {
            return new Builder({
                store: this.store,
                graphName: this.graphName,
                subject: "<" + subject + ">"
            });
        },
        /**
         * Adds a type IRI to the builder's object
         * @param {String} type
         */
        addType: function (type) {
            return this.addTriple("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", "<" + type + ">");
        },
        /**
         * Adds a type IRI to the builder's object
         * @param {String} prop
         * @param {String} value
         */
        setValue: function (prop, value) {
            return this.removeValue(prop)
                .addTriple(prop, value);
        },
        /**
         * Adds a Triple to the current graph for the Builders subject
         * @param {String} predicate
         * @param {String} object
         */
        addTriple: function (predicate, object) {
            this.store.add(new this.Triple({
                subject: this.subject,
                predicate: predicate,
                object: object
            }), this.graphName);
            return this;
        },
        /**
         * Adds a Triple to the current graph for the Builders subject
         * @param {String} predicate
         */
        removeValue: function (predicate) {
            this.store.removeMatches(this.subject, predicate, null, this.graphName);
            return this;
        }
    });

    return Builder
});