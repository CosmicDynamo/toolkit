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
 * @module jazzHands.parser.sparql.triplesNode
 */
define([
    "blocks/promise/when",
    "blocks/promise/all",
    "./triplesNodePath",
    "./varOrTerm",
    "./propListPath",
    "blocks/require/create"
], function (when, all, triplesNodePath, varOrTerm, propListPath, create) {
    /**
     * [81] TriplesSameSubjectPath ::= VarOrTerm PropertyListPathNotEmpty | TriplesNodePath PropertyListPath
     * @see http://www.w3.org/TR/sparql11-query/#rTriplesSameSubjectPath
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    return function (data) {
        var source = {};
        var s = when(triplesNodePath(data), function (found) {
            source.subject = !!found;
            return found || varOrTerm(data);
        });

        return when(s, function (subject) {
            if (!subject) {
                return null;
            }
            var pList = propListPath(data);
            return when(pList, function (predicates) {
                if (source.subject) {
                    predicates = required(predicates, "Subject missing predicate");
                }

                if (predicates) {
                    return all(predicates.map(function (details) {
                        return create("jazzHands/query/match/TriplePath", {
                            subject: subject,
                            predicate: details.predicate,
                            object: details.object
                        });
                    }));
                }
                return subject;
            });
        });
    }
});