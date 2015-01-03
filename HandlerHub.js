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
    "blocks/require/Aliased",
    "blocks/promise/when",
    "core/convert"
], function (declare, lang, _Component, Aliased, when, convert) {
    var rdfType = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>";
    var aps = function(term){
        return "<http://vocab.cosmicdynamo.net/presentation.owl#" + term + ">";
    };
    /**
     * Takes an RDF object and finds the registered code to 'handle' it
     * @description uses rdf:type to match up an RDF object the the code-base that should be
     * used to process that object.
     * @class core.HandlerHub
     * @mixes core.app._Component
     */
    return declare([_Component], {
        /** @property {String} name of the RDF Graph which contains the Hub's configuration data */
        configGraph: null,
        /** @property {String} name of the method to call to trigger the 'handling' process */
        handleMethod: "handle",
        /** @property {blocks.require.Aliased} */
        require: null,
        /** @property {String} */
        handlerType: aps("Handler"),
        constructor: function(){
            this.require = new Aliased();
        },
        postscript: function(){
            this.inherited(arguments);
            this[this.handleMethod] = this.handle;
        },
        loadConfig: function(config){
            var hub = this;
            var store = hub.app().store;
            var graphName = hub.configGraph;

            if (config && config.load) {
                var loaded = when(convert.loadFile(config.load, "RdfGraph"), function (data) {
                    store.addAll(data, graph);
                });
            }

            return when(loaded, function(){
                var graph = store.getGraph(graphName);
                graph.match(null, rdfType, hub.handlerType).forEach(function (handler) {
                    var iri = handler.subject.toNT();
                    var mid = graph.match(iri, aps("moduleId"), null).toArray()[0].object.valueOf();
                    graph.match(iri, aps("handlesType"), null).forEach(function (type) {
                        hub.require.register(type.object.valueOf(), mid);
                    })
                })
            })
        },
        /**
         * Finds the appropriate handler and executes it for the input object
         * @param {RdfJs.Node} iri - Identifier for the object being handled
         * @param {Object} options - configuration options
         * @param {RdfJs.Graph | String} options.handleGraph - graph which contains the data for the object being handled
         */
        handle: function(iri, options){
            var graph = options.handleGraph;
            if (lang.isString(options.handleGraph)){
                options.handleGraph = graph = this.app().store.getGraph(graph);
            }

            var type = graph.match(iri.toNT(), rdfType, null).toArray().map(function(triple){
                return triple.object.toString();
            });

            var handled = null;
            for(var idx = 0; idx < type.length; idx++){
                handled = this.require.load(type[idx], function(module){
                    return this._callHandler(module, iri, options);
                }.bind(this));
                if (handled){
                    break;
                }
            }

           return handled;
        },
        _callHandler: function(module, iri, options){
            var inst = (lang.isFunction(module))?new module(options):module;

            return inst[this.handleMethod](iri, options);
        }
    });
});