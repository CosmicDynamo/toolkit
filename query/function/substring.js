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
 * @module jazzHands.query.function.boolean
 */
define([
    "./boolean",
    "RdfJs/Node",
    "jazzHands/query/exception/InvalidArgumentType"
], function(boolean, Node, InvalidArgumentType){
    var xsdString = "http://www.w3.org/2001/XMLSchema#string";
    /**
     * returns  substring of the input string
     * @see http://www.w3.org/TR/xpath-functions/#func-substring
     * @param {RdfJs.Node} source
     * @param {RdfJs.Node} length
     * @param {RdfJs.Node} [start]
     * @return {RdfJs.node.Literal<String>}
     * @throws err:FORG0006, Invalid argument type
     */
    function substring(source, start, length){
        var valid = source && source.isLiteral() && (source.datatype || xsdString) === xsdString;
        if (!valid){
            throw new InvalidArgumentType({ input: source, module: "jazzHands/query/function/substring" });
        }
        source = source.valueOf();
        var len;
        if (length){
            len = length.valueOf();
        } else {
            len = source.length;
        }
        if (isNaN(len) && Math.abs(len) != Number.POSITIVE_INFINITY){
            len = -1;
        }
        var startAt = Math.ceil(start && start.valueOf());
        if (isNaN(startAt) && Math.abs(len) != Number.POSITIVE_INFINITY){
            startAt = source.length+1;
        }
        var end = --startAt + len;
        var out = "";
        for (var idx = startAt || 0; idx < end && idx < source.length; idx++){
            out += source[idx] || "";
        }

        return new Node('"' + out + '"^^<' + xsdString + ">");
    }
    return substring;
});
