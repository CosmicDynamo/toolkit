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
    "blocks/parser/keyWor",
    "blocks/promise/when",
    "blocks/parser/range",
    "blocks/require/create"
], function (keyWord, when, range, create) {
    /**
     * [11] DescribeQuery ::= 'DESCRIBE' ( VarOrIri+ | '*' ) DatasetClause* WhereClause? SolutionModifier
     * @see http://www.w3.org/TR/sparql11-query/#rDescribeQuery
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */
    function describeQuery(data) {
        if (keyWord(data, "DESCRIBE", false, true)) {
            return require([
                "jazzHands/parser/sparql/varOrIri",
                "jazzHands/parser/sparql/whereClause",
                "jazzHands/parser/sparql/solutionModifier"
            ], function (varOrIri, whereClause, solutionModifier) {
                var args = {};
                var parsing = keyWord(data, '*', false, true) || range(data, 1, -1, varOrIri);

                var dataSet = when(parsing, function (clause) {
                    args.variable = clause;

                    return range(data, 0, -1, "jazzHands/parser/sparql/clause/dataSet");
                });

                var where = when(dataSet, function (clause) {
                    args.dataSet = clause;
                    return whereClause(data);
                });

                var modifier = when(where, function (clause) {
                    args.where = clause;
                    return solutionModifier(data);
                });

                return when(modifier, function (clause) {
                    args.solutionModifier = clause;

                    return create("jazzHands/query/operation/Describe", args);
                });
            });
        }
        return null;
    }

    return describeQuery;
});