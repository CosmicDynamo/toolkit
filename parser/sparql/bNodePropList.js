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
 * @module jazzHands.parser.sparql.bNodePropList
 */
define([
    "blocks/promise/all",
    "blocks/require/create",
    "blocks/parser/block",
    "RdfJs/node/Blank"
], function (all, create, block, BlankNode) {
    /**
     * [99] BlankNodePropertyList ::= '[' PropertyListNotEmpty ']'
     * @see http://www.w3.org/TR/sparql11-query/#rBlankNodePropertyList
     * @property {jazzHands.parser.Data} data
     * @return {Promise<jazzHands.query.match.Triple[]> | Null}
     */
    function bNodePropList(data) {
        var list = block(data, "[", "]", 1, 1, "jazzHands/parser/sparql/propListNotEmpty");
        if (list) {
            var subject = new BlankNode();
            return all(list.map(function (rest) {
                return create("jazzHands/query/match/Triple", {
                    subject: subject,
                    predicate: rest.predicate,
                    object: rest.object
                });
            }));
        }
        return null;
    }

    return bNodePropList;
});