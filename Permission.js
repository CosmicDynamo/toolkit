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
 * @module service.Permission
 */
define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * @class service.Permission
     */
    return declare([], {
        /**
         * Check permissions for the Current User to see if they can edit the object in question
         * @param {RdfJs.Node} subject - Subject IRI of the object to be edited
         * @param {RdfJs.Node} objectType - Type IRI of the current representation of this object
         * @param {RdfJs.Graph} graph - Triples related to the object for State-Based permissions
         * @returns {boolean}
         */
        canEdit: function(subject, objectType, graph){
            //TODO: This
            return true;
        },
        /**
         * Check permissions for the Current User to see if they can edit the object in question
         * @param {RdfJs.Node} parent - Subject IRI of the object to be edited
         * @param {RdfJs.Node} predicate - Subject IRI of the object to be edited
         * @param {RdfJs.Node} objectType - Type IRI of the current representation of this object
         * @param {RdfJs.Graph} graph - Triples related to the object for State-Based permissions
         * @returns {boolean}
         */
        canAdd: function(parent, predicate, objectType, graph){
            //TODO: This
            return true;
        }
    });
});