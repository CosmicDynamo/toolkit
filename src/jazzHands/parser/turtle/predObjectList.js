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
 * @module jazzHands.parser.sparql.propListNotEmpty
 */
define([
    "blocks/promise/when",
    "blocks/parser/range",
    "../sparql/verb",
    "./objectList"
], function (when, range, verb, objectList) {
    /**
     * [77] PropertyListNotEmpty ::= Verb ObjectList ( ';' ( Verb ObjectList )? )*
     * @see http://www.w3.org/TR/sparql11-query/#rPropertyListNotEmpty
     * @property {jazzHands.parser.Data} data
     * @return {{predicate:RdfJs.Node, object:RdfJs.Node}[] | Null}
     */
    function propListNotEmpty(data) {
        var promise = range(data, 1, -1, function () {
            var predicate = verb(data);
            if (!predicate) {
                return null;
            }
            var objects = objectList(data);

            return when(objects, function (list) {
                return list.map(function (object) {
                    return {
                        predicate: predicate,
                        object: object
                    };
                });
            })
        }, ";");
        return when(promise, function (list) {
            if (list) {
                var proto = [];
                return proto.concat.apply(proto, list);
            }
            return null;
        });
    }

    return propListNotEmpty;
});