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
    "../_Instance",
    "blocks/promise/when",
    "blocks/promise/all"
], function (declare, _Get, _Instance, when, all) {
    /**
     * @class service.handler.request.get.Instance
     * @mixes service.handler.request._Get
     * @mixes service.handler.request._Instance
     */
    return declare([_Get, _Instance], {
        /**
         * Fill in calculated values and add Hypermedia Controls
         * @returns {Promise | *}
         * @override service.handler._Request#logic
         */
        logic: function(){
            var handler = this;

            var ready = handler.builder.load(); //Load the response data for this request

            var data = handler.builder;
            ready = when(ready, function(found){
                if (!found){
                    handler.setStatus(404);
                    handler.preventSave = true;
                    return true;
                }
                //Type information is not stored, but is 'Calculated' based on the URL used to get the data
                //  This is to better deal with multi-representation's and framing of bad type data coming from the client
                data.addType(handler.objectType);

                return handler.expandChildren();
            });

            ready = when(ready, function(){
                if (handler.preventSave){
                    return null;
                }

                return handler.addSaveLink(handler);
            });

            return ready;
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
            //NOOP - Default behavior is to leave as is
            return this;
        },
        /**
         * Detects and Connects the source data Link for this input predicate
         * @param predicate
         * @return {Promise | *}
         */
        addSourceLink:function(predicate){
            //TODO: THis
        },
        /**
         * Add the Hypermedia Link that will allow this object to be Updated
         */
        addSaveLink: function(){
            var handler = this;
            var data = handler.builder;

            if (handler.app().permission.canEdit(data.subject, data.objectType, data)) {
                data.allowReplace(handler.objectType);
            }
        }
    });
});