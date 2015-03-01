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
 * @module service.Ontology
 */
define([
    "dojo/_base/declare",
    "core/app/_Component"
], function (declare, _Component) {
    /**
     * @class service.Ontology
     * @mixes core.app._Component
     */
    return declare([_Component], {
        /**
         * Get the list of Properties for this provided objectType
         * @param {RdfJs.node.Named} objectType - the type for which to get properties
         * @returns {RdfJs.node.Named[]}
         */
        getProperties: function(objectType){
            return [];
        },
        /**
         * Returns true tf the given predicate refers to an ordered list of the input datatype
         * @param {RdfJs.node.Named} predicate
         * @param {RdfJs.node.Named} objectType
         * @returns {boolean}
         */
        isCollection: function(predicate, objectType){
            return false;
        },
        /**
         * Validate the provided data as if it were the desired objectType
         * @param {service.builder._Builder} instance
         * @param {RdfJs.node.Named} objectType
         */
        validate: function(instance, objectType){
            return true;
        }
    });
});