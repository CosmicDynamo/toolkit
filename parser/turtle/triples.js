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
 * @module jazzHands.parser.turtle.object
 */
define([
    "blocks/promise/when",
    "blocks/parser/required",
    "./subject",
    "./bNodePropList",
    "./predObjectList",
    "RdfJs/Triple"
], function (when, required, subject, bNodePropList, predObjectList, Triple) {
    /**
     * [6] triples ::= subject predicateObjectList | blankNodePropertyList predicateObjectList?
     * @see http://www.w3.org/TR/turtle/#grammar-production-triples
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    function triples(data) {
        var s = subject(data);
        var isRequired = !!s;
        s = s || bNodePropList(data);

        return when(s, function (subject) {
            if (!subject) {
                return null;
            }
            var pList = predObjectList(data);
            return when(pList, function (predicates) {
                if (isRequired) {
                    predicates = required(predicates, "Subject missing predicate");
                }

                predicates.forEach(function (details) {
                    data.graph.add(new Triple(subject, details.predicate, details.object));
                });
                return subject;
            });
        });
    }

    return triples;
});