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
 * @module RdfJs.test.api.TripleStore
 */
define([
], function () {
    /**
     * Method for testing if something is a DataSet
     * @method RdfJs.test.api.TripleStore
     * @param {*} instance - The thing being tested
     * @param {qasht.Test} test - The test harness
     */
    return function (instance, test) {
        test.assertIsObject(instance);

        test.assertIsFunction(instance.addGraph, "Triple Store must have an addGraph method");
        test.assertIsFunction(instance.runOnGraphs, "Triple Store must have an runOnGraphs method");
        test.assertIsFunction(instance.setDefault, "Triple Store must have an setDefault method");
        test.assertIsFunction(instance.add, "Triple Store must have an add method");
        test.assertIsFunction(instance.addAll, "Triple Store must have an addAll method");
        test.assertIsFunction(instance.remove, "Triple Store must have an remove method");
        test.assertIsFunction(instance.removeMatches, "Triple Store must have an removeMatches method");
        test.assertIsFunction(instance.toArray, "Triple Store must have an toArray method");
        test.assertIsFunction(instance.some, "Triple Store must have an some method");
        test.assertIsFunction(instance.every, "Triple Store must have an every method");
        test.assertIsFunction(instance.filter, "Triple Store must have an filter method");
        test.assertIsFunction(instance.forEach, "Triple Store must have an forEach method");
        test.assertIsFunction(instance.match, "Triple Store must have an match method");
        test.assertIsFunction(instance.getGraph, "Triple Store must have an getGraph method");
    }
});