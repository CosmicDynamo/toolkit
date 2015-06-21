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
    "RdfJs/node/Blank",
    "blocks/parser/Data",
    "RdfJs/parser/iriRef",
    "RdfJs/parser/literal",
    "RdfJs/parser/bNodeLabel",
    "blocks/parser/hasChar",
    "RdfJs/parser/whiteSpace"
], function (Graph, Triple, Blank, Data, iriRef, literal, bNodeLabel, hasChar, whiteSpace) {
    /**
     * Converts data from a N-Triples string to an RDF Graph
     * @method RdfJs.parser.nTriples.rdfGraph
     * @param {String} data - The N-Triples string data
     * @return {RdfJs.Graph} - the resulting data
     */
    return function (string) {
        var bNodeMap = {};
        function mapBNode(value){
            if (!value || !value.isBlank()){
                return value;
            }

            if (bNodeMap[value.toNT()]){
                return bNodeMap[value.toNT()];
            }

            return bNodeMap[value.toNT()] = new Blank();
        }
        var out = new Graph();

        var data = new Data({
            input: string,
            whiteSpace: whiteSpace
        });
        while(!data.isEnd()){
            var subject = iriRef(data) || mapBNode(bNodeLabel(data));
            var predicate = iriRef(data);
            var object = iriRef(data) || literal(data) || mapBNode(bNodeLabel(data));
            var end = hasChar(data, ".", true, true);

            if (!subject || !predicate || !object || !end){
                return null;
            }

            out.add(new Triple(subject, predicate, object));
        }

        return out;
    }
});