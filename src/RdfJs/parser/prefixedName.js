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
 * @module jazzHands.parser.sparql.pnPrefix
 */
define([
    "./pNameLn",
    "RdfJs/node/Named"
], function (pNameLn, NamedNode) {
    /**
     * [137] PrefixedName ::= PNAME_LN | PNAME_NS
     * @see http://www.w3.org/TR/sparql11-query/#rPrefixedName
     * @property {jazzHands.parser.Data} data
     * @return {String | Null}
     */

    function prefixName(data) {
        //[136s]	PrefixedName	::=	PNAME_LN | PNAME_NS
        var start = data.pos;
        data.whiteSpace(data);
        var value = pNameLn(data); //There is no case for pNameNs that would not already be returned by pNameLn
        if (value == null) {
            data.pos = start;
            return null;
        }
        var map = data.prefixMap;
        var exp = map ? map.resolve(value) : value;
        if (exp === value) {
            throw {message: "Prefix not supplied: " + value.split(":")[0]};
        }
        return NamedNode(exp);
    }

    return prefixName;
});