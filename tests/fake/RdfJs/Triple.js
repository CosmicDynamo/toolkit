/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
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
 * @module tests.fake.RdfJs.Triple
 */
define([
    "intern/chai!assert",
    "dojo/_base/declare",
    "RdfJs/Triple",
    "./Node",
    "api/RdfJs/Triple"
], function (assert, declare, Triple, Node, testApi) {
    /**
     * @class RdfJs.test.fake.Triple
     * @mixes RdfJs.Triple
     * @mixes qasht._Fake
     */
    var FakeTriple = declare([Triple], {
        postscript: function (subject, predicate, object) {
            this.inherited(arguments);

            assert.isObject(this.subject);
            assert.isObject(this.predicate);
            assert.isObject(this.object);

            this.subject = new Node(subject.subject || subject);
            this.predicate = new Node(subject.predicate || predicate);
            this.object = new Node(subject.object || object);
        },
        toNT: function () {
            assert.strictEqual(arguments.length, 0, "Triple.toNT does not take any arguments");

            return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT();
        },
        toString: function () {
            assert.strictEqual(arguments.length, 0, "Triple.toString does not take any arguments");

            return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT() + " .";
        },
        equals: function (t) {
            assert.strictEqual(arguments.length, 1, "Triple.equals takes on arguments");
            testApi(t);

            return this.subject.equals(t.subject) && this.predicate.equals(t.predicate) && this.object.equals(t.object);
        }
    });

    /**
     * @method RdfJs.test.fake.Triple#testApi
     * @param {*} object - The object being tested
     */
    FakeTriple.testApi = testApi;

    return FakeTriple;
});