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
 * @module RdfJs.parser.double
 */
define([
    "blocks/parser/hasChar",
    "blocks/parser/Exception/MissingRequired",
    "RdfJs/node/Literal",
    "./integer",
    "./exponent"
], function (hasChar, MissingRequired, Literal, integer, exponent) {
    /**
     * So much overlap, decided to save some code and put them all in one file.
     * @description Only Integer is ever used without the other two, so shared all the code to return the sum of all
     * [148] DOUBLE ::= [0-9]+ '.' [0-9]* EXPONENT | '.' ([0-9])+ EXPONENT | ([0-9])+ EXPONENT
     *
     * From Turtle
     * [16]    NumericLiteral    ::=    INTEGER | DECIMAL | DOUBLE
     * [19]    INTEGER    ::=    [+-]? [0-9]+
     * [20]    DECIMAL    ::=    [+-]? [0-9]* '.' [0-9]+
     * [21]    DOUBLE    ::=    [+-]? ([0-9]+ '.' [0-9]* EXPONENT | '.' [0-9]+ EXPONENT | [0-9]+ EXPONENT)
     * @see http://www.w3.org/TR/sparql11-query/#rDOUBLE
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @return {String | Null}
     */
    function double(data) {
        var start = data.pos;
        var dt = "integer";

        var number = hasChar(data, '+') || hasChar(data, '-') || "";

        number += integer(data) || '';

        var endInt = data.pos;
        var dec = hasChar(data, ".");
        if (dec) {
            dec = (integer(data) || '');
            if (dec) {
                dt = "decimal";
                number += '.' + dec;
            }
        }
        var exp = exponent(data) || '';

        if (exp) {
            if (number == '' || number == '.') { //'' || '.'
                throw new MissingRequired("Exponent missing value");
            }
            number += exp;
            dt = "double";
        }
        if (dt == "integer") {
            data.pos = endInt;
        }
        if (number.length) {
            return Literal(number, null, 'http://www.w3.org/2001/XMLSchema#' + dt);
        }
        data.pos = start;
        return null;
    }

    return double;
});