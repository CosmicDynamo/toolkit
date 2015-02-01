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
 * @module service.builder.hypermedia.Link
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../Base",
    "service/ontology/hm",
    "RdfJs/ontology/xsd",
    "RdfJs/node/Literal",
    "Rdfjs/node/Blank"
], function (declare, lang, Base, hm, xsd, Literal, Blank) {
    /**
     * @class service.builder.hypermedia.Link
     * @mixes service._Builder
     */
    var LinkCtor = declare([Base], {
        constructor: function(){
            this.subject = new Blank();

            this.addType(hm("HypermediaLink"));
        },
        /**
         * Sets the URL for this Link
         * @param {String} url
         * @return {service.builder.hypermedia.Link}
         */
        setUrl: function(url){
            var literal = this.app().server.pathToUrl(new Literal(url, null, xsd("url")));
            return this.setValue(hm("url"), literal);
        },
        /**
         * Defines the Method that MUST be used to call this link
         * @param {String} method
         * @return {service.builder.hypermedia.Link}
         */
        setMethod: function(method){
            return this.setValue(hm("method"), hm(method.toUpperCase()));
        },
        /**
         * Defines the ObjectType IRI that the request body MUST conform to to be acceptable for this Link
         * @param {RdfJs.node.Named} objectType
         * @return {service.builder.hypermedia.Link}
         */
        setAccepts: function(objectType){
            return this.setValue(hm("acceptsType"), objectType);
        },
        /**
         * Defines the ObjectType IRI that will be returned if this Link responds successfully
         * @param {RdfJs.node.Named} objectType
         * @return {service.builder.hypermedia.Link}
         */
        setProvides: function(objectType){
            return this.setValue(hm("providesType"), objectType);
        }
    });

    /**
     * @class service._Builder
     */
    lang.extend(Base, {
        /**
         * Adds a Link to the input resource
         * @returns {service.builder.hypermedia.Link}
         */
        addLink: function(){
            var link = new LinkCtor({
                graphName: this.graphName
            });

            this.addValue(hm("hasLink"), link.subject);

            //It can be changed later, but most Links use their subject IRI as their URL
            if (this.subject.isNamed()) {
                link.setUrl(this.subject.toString());
            }
            return link;
        }
    });

    return LinkCtor;
});