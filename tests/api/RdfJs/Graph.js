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
 * @module RdfJs.test.api.Graph
 */
define([
    "intern/chai!assert"
], function (assert) {
    /**
     * Method for testing if something is an RDF Graph
     * @method RdfJs.test.api.Graph
     * @param {*} instance - The thing being tested
     */
    return function (instance) {
        assert.isObject(instance);

        assert.isFunction(instance.add, "Graph must have an add method");
        assert.isFunction(instance.addAll, "Graph must have an addAll method");
        assert.isFunction(instance.remove, "Graph must have an remove method");
        assert.isFunction(instance.removeMatches, "Graph must have an removeMatches method");
        assert.isFunction(instance.toArray, "Graph must have an toArray method");
        assert.isFunction(instance.some, "Graph must have an some method");
        assert.isFunction(instance.every, "Graph must have an every method");
        assert.isFunction(instance.filter, "Graph must have an filter method");
        assert.isFunction(instance.forEach, "Graph must have an forEach method");
        assert.isFunction(instance.match, "Graph must have an match method");
        assert.isFunction(instance.merge, "Graph must have a merge method");
        assert.isFunction(instance.clone, "Graph must have a clone method");
        assert.isFunction(instance.has, "Graph must have a has method");

    }
});