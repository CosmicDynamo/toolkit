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
 * @module RdfJs.Triple
 */
define([
    "dojo/_base/declare",
    "dojo/Stateful",
    "./Node"
], function (declare, Stateful, Node) {
    /**
     * @class RdfJs.Triple
     * @mixes dojo.Stateful
     * @see http://www.w3.org/TR/rdf-interfaces/#idl-def-Triple
     */
    return declare([Stateful], {
        subject: null,
        predicate: null,
        object: null,
        Node: null,
        postscript: function () {
            this.inherited(arguments);

            this.Node = this.Node || Node;

            this._validate("subject");
            this._validate("predicate");
            this._validate("object");
        },
        /**
         * Returns the NT String form of this Triple
         * @see http://www.w3.org/TR/rdf-interfaces/#widl-Triple-toString-stringifier-DOMString
         * @returns {string}
         */
        toString: function () {
            return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT() + " .";
        },
        /**
         * Compares this triple to another
         * @see http://www.w3.org/TR/rdf-interfaces/#widl-Triple-equals-boolean-Triple-otherTriple
         * @param {RdfJs.Triple} t - triple to compare
         * @returns {boolean}
         */
        equals: function (t) {
            return this.subject.equals(t.subject) && this.predicate.equals(t.predicate) && this.object.equals(t.object);
        },
        /**
         * Converts a input from a String to an RDF Node
         * @param {String} name
         * @private
         */
        _validate: function (name) {
            var val = this[name];

            if (lang.isString(val)) {
                this[name] = new this.Node(val);
            }
        }
    });
});