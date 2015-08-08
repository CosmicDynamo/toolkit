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
 * @module jazzHands.tools.GraphReader
 */
define([
    "dojo/_base/declare",
    "RdfJs/Graph"
], function (declare, Graph) {
    /**
     * @class jazzHands.tools.GraphReader
     */
    var GraphReader = declare([], {
        graph: null,
        _values: null,
        constructor: function(args){
            this.graph = args.graph;
            this._values = args.values;
            this.length = this.values?this.values.length:this.graph.length;
        },
        filter: function(predicate, object){
            var graph = this.graph;
            var subjects =this.subjects();

            if (!subjects) {
                return this._subset(graph.match(null, predicate.toNT(), object.toNT()));
            }

            return this._merge(subjects, function(subject){
                return graph.match(subject.toNT(), predicate.toNT(), object?object.toNT():null);
            });
        },
        _merge: function(values, fn){
            var out = new Graph();
            values.forEach(function(){
                out.addAll(fn.apply(this, arguments));
            });

            return this._subset(out);
        },
        _subset: function(values){
            return new GraphReader({
                graph: this.graph,
                values: values
            });
        },
        subjects: function(){
            if (!this.values){
                return null;
            }
            return this.values.toArray().map(function(triple){
                return triple.subject;
            });
        },
        objects: function(){
            if (!this.values){
                return null;
            }
            return this.values.toArray().map(function(triple){
                return triple.object;
            });
        },
        values: function(predicate){
            if (!this.values){
                return null;
            }
            return this.values.match(null, predicate.toNT(), null).toArray().map(function(triple){
                return triple.object;
            });
        },
        children: function(predicate){
            var graph = this.graph;
            var values = this.filter(predicate).objects();

            return this._merge(values, function(object){
                return graph.match(object.toNT(), null,null);
            });
        }
    });
    return GraphReader;
});