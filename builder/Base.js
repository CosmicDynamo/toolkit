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
 * @module service._Builder
 */
define([
    "dojo/_base/declare",
    "core/app/_Component",
    "blocks/genId",
    "RdfJs/Triple",
    "RdfJs/ontology/rdf",
    "blocks/promise/when"
], function (declare, _Component, genId, Triple, rdf, when) {
    /**
     * Used for creating/updating triples in a graph of data
     * @class service._Builder
     * @mixes core.app._Component
     */
    return declare([_Component], {
        /**
         * @property The root subject of the Object being updated
         * @type {RdfJs.Node}
         */
        subject:null,
        /**
         * @property Name of the graph which contains the object being built
         * @type {String}
         */
        graphName: null,
        constructor: function(){
            this.graphName = genId();
        },
        /**
         * Loads the persisted data for the builder's subject
         * @returns {Promise<Boolean>}
         */
        load: function(){
            var builder = this;
            return when(this.app().data.get(this.subject), function(data){
                if (!data){
                    return false;
                }
                var graph = builder.graph();
                graph.addAll(data);
                return true;
            });
        },
        /**
         * Adds a rdf:type Triple for the current subject
         * @param {RdfJs.Node} objectType - Type IRI
         * @returns {service._Builder}
         */
        addType: function(objectType){
            return this.addValue(rdf("type"), objectType);
        },
        /**
         * Adds a Triple to the graph with the given predicate and object
         * @description Used for adding Unordered 'set' values into the graph
         * @param {RdfJs.Node} predicate - predicate of the Triple to add
         * @param {RdfJs.Node} value - object of the Triple to add
         * @returns {service._Builder}
         */
        addValue: function(predicate, value){
            this.graph().add(new Triple(this.subject, predicate, value));
            return this;
        },
        /**
         * Returns the graph containing this Builder's data
         * @returns {RdfJs.Graph}
         */
        graph: function(){
            return this.app().data.getGraph(this.graphName, true);
        },
        /**
         * Updates the object for a given predicate to the input value
         * @description Used for setting values where you want the previous value removed
         * @param {RdfJs.Node} predicate - predicate of the Triple to add
         * @param {RdfJs.Node} value - object of the Triple to add
         * @returns {service._Builder}
         */
        setValue: function(predicate, value){
            return this.clear(predicate).addValue(predicate, value)
        },
        /**
         * Removes all values associated with the input predicate
         * @param {RdfJs.Node} predicate - predicate of the Triple to add
         * @returns {service._Builder}
         */
        clear: function(predicate){
            this.graph().removeMatches(this.subject.toNT(), predicate.toNT(), null);
            return this;
        }
    });
});