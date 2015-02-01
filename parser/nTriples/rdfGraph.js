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
 * @module RdfJs.parser.nTriples.rdfGraph
 */
define([
    "RdfJs/Graph",
    "RdfJs/Triple",
    "blocks/parser/Data",
    "RdfJs/parser/iri",
    "RdfJs/parser/literal",
    "RdfJs/parser/bNode",
    "blocks/parser/hasChar",
    "RdfJs/parser/whiteSpace"
], function (Graph, Triple, Data, iri, literal, bNode, hasChar, whiteSpace) {
    /**
     * Converts data from a N-Triples string to an RDF Graph
     * @method RdfJs.parser.nTriples.rdfGraph
     * @param {String} data - The N-Triples string data
     * @return {RdfJs.Graph} - the resulting data
     */
    return function (string) {
        var out = new Graph();

        var data = new Data({
            input: string,
            whiteSpace: whiteSpace
        });
        while(!data.isEnd()){
            var subject = iri(data) || bNode(data);
            var predicate = iri(data);
            var object = iri(data) || bNode(data) || literal(data);
            var end = hasChar(data, ".", true, true);

            if (!subject || !predicate || !object || !end){
                return null;
            }

            out.add(new Triple(subject, predicate, object));
        }

        return out;
    }
});