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
 * @module core.HandlerHub
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "core/app/_Component",
    "blocks/require",
    "RdfJs/node/Literal",
    "RdfJs/Graph",
    "core/ontology/pres"
], function (declare, lang, _Component, require, Literal, Graph, pres) {
    /**
     * Takes an RDF object and finds the registered code to 'handle' it
     * @description uses rdf:type to match up an RDF object the the code-base that should be
     * used to process that object.
     * @class core.HandlerHub
     * @mixes core.app._Component
     */
    return declare([_Component], {
        /** @property {String} name of the method to call to trigger the 'handling' process */
        handleMethod: "handle",
        /** @property {String} NT Form IRI for pres:hasPurpose */
        hasPurpose: null,
        /** @property {String} NT Form IRI for pres:moduleId */
        moduleId: null,
        constructor: function(){
            this.hasPurpose = pres("handlePurpose").toNT();
            this.moduleId = pres("moduleId").toNT();
        },
        postscript: function(){
            this.inherited(arguments);

            this[this.handleMethod] = this.handle;
        },
        /**
         * Finds the appropriate handler and executes it for the input object
         * @param {RdfJs.Node} iri - Identifier for the object being handled
         * @param {Object} [options] - configuration options
         * @param {RdfJs.Node[]} [options.handleAs] - Use these type IRIs instead of values from the RDF graph
         * @param {String} [options.purpose] - A modifier to use when choosing the handler for this object
         * @param {RdfJs.Graph | String} [options.handleGraph] - graph which contains the data for the object being handled
         */
        handle: function(iri, options){
            options = options || {};


            var types;
            if (options.handleAs) {
                types = [options.handleAs];
            } else {
                var handleGraph = options.handleGraph;
                if (lang.isString(handleGraph)){
                    options.handleGraph = this.app().store.getGraph(handleGraph);
                }

                types = options.handleGraph.match(iri.toNT(), "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", null).toArray().map(function(triple){
                    return triple.object;
                });
            }

            var graph = this.config();
            var handlers = new Graph();
            types.forEach(function(typeIri){
                handlers.addAll(graph.match(null, pres("handlesType").toNT(), typeIri.toNT()).toArray());
            });
            var method = this.handleMethod;

            var purpose = Literal(options.purpose || "ANY", null, "http://www.w3.org/2001/XMLSchema#string").toNT();
            var hasPurpose = this.hasPurpose;
            var handler = handlers.toArray().find(function(triple){
                return graph.match(triple.subject.toNT(), hasPurpose, purpose).length > 0;
            });

            if (!handler){
                return null;
            }

            var moduleId = this.moduleId;
            var mid = graph.match(handler.subject.toNT(), moduleId, null).toArray()[0].object;

            return require([mid.valueOf()], function(module){
                var inst = (lang.isFunction(module))?new module(options):module;

                if (options.noExec){
                    return inst;
                }
                return inst[method](iri, options);
            });
        }
    });
});