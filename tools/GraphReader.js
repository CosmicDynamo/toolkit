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
 * @module RdfJs.tools.GraphReader
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../Node",
    "../PrefixMap"
], function (declare, lang, Node, PrefixMap) {
    /**
     * @class RdfJs.tools.GraphReader
     * @mixes RdfJs.Node
     */
    var GraphReader = declare([], {
        /** @property {RdfJs.PrefixMap} */
        prefixes: null,
        constructor: function(iri, graph){
            lang.mixin(this, new Node(iri));
            this.graph = graph;

            this.prefixes = new PrefixMap({ values:{
                rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#"
            }});
        },
        /**
         * Returns the value(s) associated with the input term
         * @param {String} curie - IRI or Curie of the predicate
         * @return {RdfJs.Node[]} - Set Values for that predicate
         */
        get: function(curie){
            return this.graph.match(this.toNT(), "<" + this.prefixes.resolve(curie) + ">", null).toArray().map(function(triple){
                var out = new GraphReader(triple.object.toNT(), this.graph);
                out.prefixes= this.prefixes;
                return out;
            }.bind(this));
        },
        getOrdered: function(curie){
            var out = [];
            this.get(curie).forEach(function (subject) {
                var left = subject.get("rdf:first");
                var right = subject.getOrdered("rdf:rest");
                out = out.concat(left, right);
            });

            return out;
        }
    });
    return GraphReader;
});