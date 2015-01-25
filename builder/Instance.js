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
 * @module service.builder.Instance
 */
define([
    "dojo/_base/declare",
    "./Base",
    "service/ontology/jss",

//Extensions
    "./hypermedia/Link"
], function (declare, Base, jss) {
    /**
     * Used for creating/updating triples representing a single Instance of data
     * @class service.builder.Instance
     * @mixes service._Builder
     */
    return declare([Base], {
        /**
         * Adds a Hypermedia Update Link which will replace the current representation with the request body
         * @param {RdfJs.node.Named} objectType - the type of representation being replaced
         * @returns {service.builder.Instance}
         */
        allowReplace: function(objectType){
            this.addLink()
                .addType(jss("Update"))
                .setMethod("put")
                .setUrl(this.subject.toString())
                .setAccepts(objectType)
                .setProvides(objectType);
            return this;
        },
        /**
         * Adds a Hypermedia Update Link which will modify the current representation using the request body
         * @param {RdfJs.node.Named} objectType - the type of representation being modified
         * @returns {service.builder.Instance}
         */
        allowPatch: function(objectType){
            this.addLink()
                .addType(jss("Update"))
                .setMethod("patch")
                .setUrl(this.subject.toString())
                .setAccepts(objectType)
                .setProvides(objectType);
            return this;
        }
    });
});