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
 * @module jazzHands.query.graph.Loader
 */
define([
    "dojo/_base/declare",
    "dooj/Stateful"
], function (declare, Stateful) {
    /**
     * Handles runtime loading of Graph data for use by the query/Graph
     * @description If named this will return the graph in question; other-wise it will
     * fetch the data from the 'server' using the request object provided in the query options
     * @class jazzHands.query.graph.Loader
     */
    return declare([Stateful], {
        /** @property {Boolean} - does this represen a named graph  */
        named: null,
        /** @property {RdfJs.node.Named} - the name of the graph in question */
        iri: null,
        load: function (options) {
            if (this.named || !options.fetch) {
                return this.iri.valueOf();
            }

            return options.fetch(this.iri.valueOf(), {
                method: "get",
                accept: "RdfGraph"
            });
        }
    });
});