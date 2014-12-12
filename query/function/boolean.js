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
    "dojo/_base/lang",
    "RdfJs/Node",
    "jazzHands/query/exception/InvalidArgumentType"
], function(lang, Node, InvalidArgumentType){
    var xsdBoolean = "http://www.w3.org/2001/XMLSchema#boolean";
    /**
     * Converts an expression result to a Boolean Node
     * @see http://www.w3.org/TR/xpath-functions/#func-boolean
     * @param {RdfJs.Node | RdfJs.Node[]} node
     * @return {RdfJs.node.Literal<Boolean>}
     * @throws err:FORG0006, Invalid argument type
     */
    function boolean(node){
        var out;
        if (lang.isArray(node)){
            out = node.length > 0;
        } else if (node.isLiteral()) {
            if (node.datatype === xsdBoolean){
                return new Node(node.toNT());
            }
            var value = node.valueOf();
            if (lang.isString(value)){
                out = value.length > 0;
            } else {
                out = !isNaN(value) && value !== 0;
            }
        } else {
            throw new InvalidArgumentType({ input: node, module: "jazzHands/query/function/boolean" });
        }
        var text = out?"true":"false";

        return new Node('"' + text + '"^^<' + xsdBoolean + '>');
    }
    return boolean;
});