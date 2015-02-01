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
 * @module service.builder.Container
 */
define([
    "dojo/_base/declare",
    "./Base",
    "jazzHands/LinkedList",
    "service/ontology/collection"
], function (declare, Base, LinkedList, collection) {
    /**
     * @class service.builder.Container
     * @mixes service._Builder
     */
    return declare([Base], {
        /**
         * @property
         * @type {RdfJs.Node}
         */
        memberSubject: null,
        /**
         * @property
         * @type {RdfJs.node.Named}
         */
        predicate: null,
        constructor: function(){
           this.lListRoot = new LinkedList({
               subject: args.memberSubject,
               predicate: args.predicate
           })
        },
        postscript: function(){
            this.inherited(arguments);

            this.addType(collection("Container"))
                .setValue(collection("membershipSubject"), this.memberSubject)
                .setValue(collection("membershipPredicate"), this.predicate);
        }
    });
});