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
 * @module core._Handler
 */
define([
    "dojo/_base/declare",
    "./app/_Component"
], function (declare, _Component) {
    /**
     * Represents a class that generically handles performing some operation on a piece of data
     * @class core._Handler
     * @mixes core.app._Component
     * @interface
     */
    return declare([_Component], {
        /**
         * Main method called when a piece of RDF data needs ...'handling'
         * @param {RdfJs.Node} iri - The Subject Identifier of the data being handled
         * @param {Object} args - arguments that can be used to control how the data is handled
         * @param {RdfJs.Graph} args.handleGraph - The graph containing the data associated with this subject
         * @return {Promise<*>} - Promise that will be resolved when handling is complete.
         */
        handle: function(iri, args){

        }
    });
});