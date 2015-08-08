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
 * @module $<class>$
 */
define([
    "blocks/parser/keyWord",
    "blocks/parser/block",
    "blocks/parser/required",
    "blocks/parser/range",
    "blocks/promise/when",
    "blocks/promise/all",
    "blocks/require/create"
], function (keyWord, block, required, range, when, all, create) {
    /**
     * [10] ConstructQuery ::= 'CONSTRUCT' ( ConstructTemplate DatasetClause* WhereClause SolutionModifier | DatasetClause* 'WHERE' '{' TriplesTemplate? '}' SolutionModifier )
     * @see http://www.w3.org/TR/sparql11-query/#rConstructQuery
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function constructQuery(data) {
        if (keyWord(data, "CONSTRUCT", false, true)) {
            return require([
                "jazzHands/parser/sparql/constructTemplate",
                "jazzHands/parser/sparql/whereClause",
                "jazzHands/parser/sparql/solutionModifier"
            ], function (constructTemplate, whereClause, solutionModifier) {
                var args = {};
                var template = constructTemplate(data);

                var dataSet = when(template, function (clause) {
                    args.template = clause;

                    return range(data, 0, -1, "jazzHands/parser/sparql/clause/dataSet");
                });

                var where = when(dataSet, function (clause) {
                    args.dataSet = clause;
                    if (args.template) {
                        return whereClause(data);
                    }
                    if (!keyWord("WHERE")) {
                        return null;
                    }

                    return block(data, "{", "}", 0, 1, "jazzHands/parser/sparql/triplesTemplate");
                });

                var modifier = when(where, function (clause) {
                    args.where = required(clause, "Construct Missing WHERE clause");

                    return solutionModifier(data);
                });

                return when(modifier, function (clause) {
                    args.solutionModifier = clause;

                    return create("jazzHands/query/operation/Construct", args);
                });
            });
        }
        return null;
    }

    return constructQuery;
});