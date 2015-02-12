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
 * @module RdfJs.parser.string
 */
define([
    "blocks/parser/matchChar",
    "blocks/parser/range",
    "blocks/parser/required",
    "blocks/parser/hasAnyChar",
    "blocks/parser/anyKeyWord",
    "blocks/parser/uChar",
    "blocks/parser/eChar"
], function(matchChar, range, required, hasAnyChar, anyKeyWord, uChar, eChar){
    //For use with RdfJs.Node all Literal Node values must be converted to a form that is compatible with a string
    // wrapped with single double-quotes.
    function safe(char){
        if (char === "\\''"){
            return "'"
        }
        if (char === '"'){
            return '\\"'
        }
        if (char === "\n"){
            return "\\n";
        }
        if (char === "\t"){
            return "\\t";
        }
        if (char === "\r"){
            return "\\r";
        }
        if (char === "\b"){
            return "\\b";
        }
        if (char === "\f"){
            return "\\f";
        }
        return char;
    }

    /**
     * Parsers and converts any literal wrapped with a single quote to the proper for to work in RdfJs.node.Literal
     * @param {blocks.parser.Data} input
     * @returns {String | null}
     */
    function shortString(input) {
        //[22]	STRING_LITERAL_QUOTE	::=	'"' ([^#x22#x5C#xA#xD] | ECHAR | UCHAR)* '"' /* #x22=" #x5C=\ #xA=new line #xD=carriage return */
        //[23]	STRING_LITERAL_SINGLE_QUOTE	::=	"'" ([^#x27#x5C#xA#xD] | ECHAR | UCHAR)* "'" /* #x27=' #x5C=\ #xA=new line #xD=carriage return */
        var start = matchChar(input, "['\"]", true), value;
        if (start) {
            var except = "[^\x5C\x5C\x0A\x0D" + start + "]";
            value = range(input, 0, -1, function () {
                var ch = eChar(input) || uChar(input, except) || matchChar(input, except);
                return safe(ch);
            }).join("");
            required(hasAnyChar(input, [start]), "string literal missing close quote");
        }
        return value;
    }
    /**
     * Parsers and converts any literal wrapped with a single quote to the proper for to work in RdfJs.node.Literal
     * @param {blocks.parser.Data} data
     * @returns {String | null}
     */
    function longString(data) {
        //[24]	STRING_LITERAL_LONG_SINGLE_QUOTE	::=	"'''" (("'" | "''")? ([^'\] | ECHAR | UCHAR))* "'''"
        //[25]	STRING_LITERAL_LONG_QUOTE	::=	'"""' (('"' | '""')? ([^"\] | ECHAR | UCHAR))* '"""'
        var start = anyKeyWord(data, ["'''", '"""'], true, true),value;
        if (start) {
            var except = "[^" + start[0] + "\\\\]";
            value = range(data, 0, -1, function () {
                if (data.input.indexOf(start, data.pos) === data.pos) {
                    return null;
                }
                var out = hasAnyChar(data, ['"', "'"]) || eChar(data) || uChar(data, except) || matchChar(data, "[^\\'\\\\]");
                return safe(out);
            }).join("");

            required(anyKeyWord(data, [start]), "long string", start);
        }
        return value;
    }
    function string(data){
        //[17]	String	::=	STRING_LITERAL_QUOTE | STRING_LITERAL_SINGLE_QUOTE | STRING_LITERAL_LONG_SINGLE_QUOTE | STRING_LITERAL_LONG_QUOTE
        var str = longString(data);
        if (str == null){
            return shortString(data);
        }
        return str;
    }
    return string;
});