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
], function () {
    /**
     * Method for testing if something is an RDF Graph
     * @method RdfJs.test.api.Graph
     * @param {*} instance - The thing being tested
     * @param {qasht.Test} test - The test harness
     */
    return function (instance, test) {
        test.assertIsObject(instance);

        test.assertIsFunction(instance.add, "Graph must have an add method");
        test.assertIsFunction(instance.addAll, "Graph must have an addAll method");
        test.assertIsFunction(instance.remove, "Graph must have an remove method");
        test.assertIsFunction(instance.removeMatches, "Graph must have an removeMatches method");
        test.assertIsFunction(instance.toArray, "Graph must have an toArray method");
        test.assertIsFunction(instance.some, "Graph must have an some method");
        test.assertIsFunction(instance.every, "Graph must have an every method");
        test.assertIsFunction(instance.filter, "Graph must have an filter method");
        test.assertIsFunction(instance.forEach, "Graph must have an forEach method");
        test.assertIsFunction(instance.match, "Graph must have an match method");
        test.assertIsFunction(instance.merge, "Graph must have a merge method");
        test.assertIsFunction(instance.addAction, "Graph must have an addAction method");
        test.assertIsFunction(instance.clone, "Graph must have a clone method");
        test.assertIsFunction(instance.has, "Graph must have a has method");
    }
});