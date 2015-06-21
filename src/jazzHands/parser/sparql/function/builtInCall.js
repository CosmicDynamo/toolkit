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
 * @module jazzHands.parser.sparql.unaryExpression
 */
define([
    "blocks/parser/anyKeyWord",
    "blocks/parser/block",
    "../expression/list",
    "RdfJs/parser/nil",
    "blocks/require/create"
    /*"./aggregate",
     "./substring",
     "./strReplace",
     "./regEx",
     "./exists",
     "./notExists"*/
], function (anyKeyWord, block, expressionList, nil, create/*aggregate, substring, strReplace, regEx, exists, notExists*/) {
    var methods = {
        'IF': "iif",
        'isIRI': "isIri",
        'isBLANK': "isBlank",
        'isLITERAL': "isLiteral",
        'isNUMERIC': "isNumeric",
        'URI': "iri",
        'STRSTARTS': "starts-with",
        'STRENDS': "ends-with",
        'STRBEFORE': "substring-before",
        'STRAFTER': "substring-after",
        'ENCODE_FOR_URI': "encode-for-uri",
        'LANGMATCHES': "langMatches"
        /* TODO
         'ABS':"",
         'CEIL':"",
         'FLOOR':"",
         'ROUND':"",
         'STRLEN':"",
         'UCASE':"",
         'LCASE':"",
         'YEAR':"",
         'MONTH':"",
         'DAY':"",
         'HOURS':"",
         'MINUTES':"",
         'isURI':"",
         'SECONDS':"",
         'TIMEZONE':"",
         'TZ':"",
         'MD5':"",
         'SHA1':"",
         'SHA256':"",
         'SHA384':"",
         'SHA512':"",
         'STRDT':"",
         'sameTerm':"",
         'RAND':"",
         'NOW':""*/
    };

    /**
     * [121] BuiltInCall ::= Aggregate | SubstringExpression | StrReplaceExpression | RegexExpression | ExistsFunc | NotExistsFunc
     *   | ( ( 'STR' | 'LANG' | 'DATATYPE' | 'IRI' | 'URI' | 'ABS' | 'CEIL' | 'FLOOR' | 'ROUND' | 'STRLEN' | 'isIRI'
     *       | 'UCASE' | 'LCASE' | 'ENCODE_FOR_URI' | 'YEAR' | 'MONTH' | 'DAY' | 'HOURS' | 'MINUTES' | 'isURI' | 'isBLANK'
     *       | 'SECONDS' | 'TIMEZONE' | 'TZ' | 'MD5' | 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512' | 'COALESCE'
     *       | 'isLITERAL' | 'isNUMERIC') '(' Expression ')' )
     *   | ( ( 'LANGMATCHES' | 'CONTAINS' | 'STRSTARTS' | 'STRENDS' | 'STRBEFORE' | 'STRLANG' | 'STRDT' | 'sameTerm'
     *       | 'STRAFTER' ) '(' Expression ',' Expression ')' )
     *   | ( 'IF' '(' Expression ',' Expression ',' Expression ')' )
     *
     *   | ( 'BNODE' ( '(' Expression ')' | NIL ) )
     *
     *   | ( ( 'RAND' | 'NOW' | 'UUID' | 'STRUUID' ) NIL )
     *
     *   | ( 'BOUND' '(' Var ')' )
     *   | ( 'CONCAT' ExpressionList )
     * @see http://www.w3.org/TR/sparql11-query/#rBuiltInCall
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    function primaryExpression(data) {
        var maxExpr = 0;
        var key = anyKeyWord(data, "IF", false, true);
        if (key) {
            maxExpr++;
        }
        key = key || anyKeyWord(data, ['LANGMATCHES', 'CONTAINS', 'STRSTARTS', 'STRENDS', 'STRBEFORE', 'STRLANG'
            , 'STRDT', 'sameTerm', 'STRAFTER'], false, true);
        if (key) {
            maxExpr++;
        }
        key = key || anyKeyWord(data, ['STR', 'LANG', 'DATATYPE', 'IRI', 'URI', 'ABS', 'CEIL', 'FLOOR', 'ROUND', 'STRLEN'
            , 'isIRI', 'UCASE', 'LCASE', 'ENCODE_FOR_URI', 'YEAR', 'MONTH', 'DAY', 'HOURS', 'MINUTES', 'isURI'
            , 'isBLANK', 'SECONDS', 'TIMEZONE', 'TZ', 'MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512', 'COALESCE'
            , 'isLITERAL', 'isNUMERIC', 'BNODE', false, true]);
        if (key) {
            maxExpr++;
        }
        var expr;
        if (key) {
            expr = block(data, "(", ")", 1, maxExpr, "jazzHands/parser/sparql/expression");
        }
        if (!key || key === 'BNODE') {
            key = key || anyKeyWord(data, ['RAND', 'NOW', 'UUID', 'STRUUID'], false, true);
            if (key) {
                expr = expr || nil(data)
            }
        }
        if (key) {
            return "blah";
        }
        if (anyKeyWord(data, ['BOUND'])) {
            expr = block(data, '(', ')', 1, 1, "jazzHands/parser/sparql/var");
            return "blah";
        }
        if (anyKeyWord(data, 'CONCAT')) {
            expr = expressionList(data);
            return "blah";
        }
        if (key) {
            return require("jazzHands/query/function/" + (methods[key] || key.toLowerCase()), function (method) {
                return create("jazzHands/query/Function", {
                    method: method,
                    arguments: expr
                });
            });
        }
        return null;
        //TODO: return find(data, [aggregate, substring, strReplace, regEx, exists, notExists]);
    }

    return primaryExpression;
});