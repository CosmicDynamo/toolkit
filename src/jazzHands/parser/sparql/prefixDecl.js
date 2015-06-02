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
 * @module jazzHands.parser.sparql.prefixDecl
 */
define([
    "blocks/require",
    "blocks/parser/required",
    "blocks/parser/keyWord"
], function (require, required, keyWord) {
    /**
     * [6] PrefixDecl ::= 'PREFIX' PNAME_NS IRIREF
     * @see http://www.w3.org/TR/sparql11-query/#rPrefixDecl
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function prefixDecl(data) {
        //[6s]	sparqlPrefix	::=	"PREFIX" PNAME_NS IRIREF
        var key = keyWord(data, "prefix", false, true);
        if (key) {
            return require(["RdfJs/parser/pNameNs", "RdfJs/parser/iriRef"], function (pNameNs, iriRef) {
                data.whiteSpace(data);
                var pfx = required(pNameNs(data), "PREFIX missing name");
                data.whiteSpace(data);
                var iri = required(iriRef(data), "PREFIX missing IRI");

                data.prefixMap.set(pfx, iri.toString());
                return iri;
            });
        }
        return null;
    }

    return prefixDecl;
});