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
 * @module jazzHands.parser.sparql.usingClause
 */
define([
    "blocks/promise/when",
    "blocks/parser/keyWord",
    "blocks/parser/required",
    "blocks/require/create",
    "RdfJs/parser/iri"
], function (when, keyWord, required, create, iri) {
    /**
     * [44] UsingClause ::= 'USING' ( iri | 'NAMED' iri )
     * @see http://www.w3.org/TR/sparql11-query/#riri
     * @property {jazzHands.parser.Data} data
     * @return {Promise<jazzHands.query.graph.Loader> | Null}
     */
    function usingClause(data) {
        if (keyWord(data, "using")) {
            var named = !!keyWord(data, "named");
            return when(required(iri(data), "USING missing iri"), function (graphName) {
                return create("jazzHands/query/graph/Loader", {
                    named: named,
                    iri: graphName
                });
            });
        }
    }

    return usingClause;
});