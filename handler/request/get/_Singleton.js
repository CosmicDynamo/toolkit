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
 * @module service.handler.request.get.Instance
 */
define([
    "dojo/_base/declare",
    "../_Get",
    "blocks/promise/when",
    "blocks/promise/all"
], function (declare, _Get, when, all) {
    /**
     * @class service.handler.request.get.Instance
     * @mixes service.handler.request._Get
     * @interface
     */
    return declare([_Get], {
        /**
         * @property
         * @type {Boolean}
         */
        skipDetails: false,
        preventSave: false,
        /**
         * Fill in calculated values and add Hypermedia Controls
         * @returns {Promise | *}
         * @override service.handler._Request#logic
         */
        logic: function(){
            var handler = this;

            var ready = handler.builder.load(); //Load the response data for this request

            ready = when(ready,this.expandDetails.bind(this));

            ready = when(ready, this.addLinks.bind(this));

            return ready;
        },
        expandDetails: function(){
            if (this.skipDetails){
                return;
            }
            var handler = this;
            //Type information is not stored, but is 'Calculated' based on the URL used to get the data
            //  This is to better deal with multi-representation's and framing of bad type data coming from the client
            handler.builder.addType(handler.objectType);

            return handler.expandChildren();
        },
        /**
         * Add any Links that can be used to interact with this object
         * @returns {*}
         */
        addLinks: function(){
            if (this.preventSave){
                return null;
            }

            return this.addSaveLink();
        },
        /**
         * Pull any Containers and add Source-Data links
         * @return {Promise | *}
         */
        expandChildren: function(){
            var handler = this;
            var properties = handler.app().ontology.getProperties(handler.objectType);

            return all(properties.map(function(predicate){
                return handler.expandProperty(predicate);
            }));
        },
        /**
         * Used to expand the value of a specific property for this representation
         * @param {RdfJs.node.Named} predicate
         * @return {Promise | *}
         */
        expandProperty: function(predicate){
            var isCollection = this.app().ontology.isCollection(predicate, this.objectType);

            var link = this.addSourceLink(predicate);
            var expansion ;
            if (isCollection){
                expansion = this.expandList(predicate);
            } else {
                expansion = this.expandSet(predicate);
            }
            return all([link, expansion]);
        },
        /**
         * Expands a predicate that has been identified as being an Ordered List of data
         * @param {RdfJs.node.Named} predicate
         * @return {Promise | *}
         */
        expandList: function(predicate){
            var data = this.builder;

            data.addContainer(predicate);
            return this;
        },
        /**
         * Expands a predicate that has been identified as being an Unordered Set of data
         * @param {RdfJs.node.Named} predicate
         * @return {Promise | *}
         */
        expandSet: function(predicate){
            //NO-OP - Default behavior is to leave as is
            return this;
        },
        /**
         * Detects and Connects the source data Link for this input predicate
         * @param predicate
         * @return {Promise | *}
         */
        addSourceLink:function(predicate){
            //TODO: This
        },
        /**
         * Add the Hypermedia Link that will allow this object to be Updated
         */
        addSaveLink: function(){
            throw { message: "Not Implemented Exception"};
        }
    });
});