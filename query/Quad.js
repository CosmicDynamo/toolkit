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
 * @module jazzHands.query.Quad
 */
define([
    "dojo/_base/declare",
    "RdfJs/Triple"
], function (declare, Triple) {
    /**
     * @class jazzHands.query.Quad
     * @mixes RdfJs.Triple
     * @mixes dojo.declare
     */
    return declare([Triple], {
        /** @property {RdfJs.node.Named} */
        graph:null,
        postscript: function(){
            this._validate("graph");
        },
        /**
         * @override RdfJs.Triple#toString
         */
        toString: function () {
            var parts = [
                this.subject.toNT(),
                this.predicate.toNT(),
                this.object.toNT(),
                this.graph.toNT()
            ];
            return parts.join(" ") + " .";
        },
        /**
         * @override RdfJs.Triple#equals
         */
        equals: function (t) {
            return this.inherited(arguments) && this.graph.equals(t.graph);
        }
    });
});