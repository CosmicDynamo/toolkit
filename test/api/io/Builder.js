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
 * @module service.test.api.io.Builder
 */
define([
    "RdfJs/test/api/TripleStore"
], function (testStoreApi) {
    /**
     * @method service.test.api.io.Builder
     * @param {*} instance
     * @param {qasht.Test} test
     */
    return function (instance, test) {
        test.assertIsObject(instance);

        testStoreApi(instance.store, test);

        if (instance.subject) {
            test.assertIsString(instance.subject, "Builder requires subject be a String");
        }
        test.assertIsString(instance.graphName, "Builder requires a String graph name");

        test.assertIsFunction(instance.exception, "Builder requires an exception function");
        test.assertIsFunction(instance.addObject, "Builder requires an addObject function");
        test.assertIsFunction(instance.addType, "Builder requires an addType function");
        test.assertIsFunction(instance.setValue, "Builder requires an setValue function");
        test.assertIsFunction(instance.addTriple, "Builder requires an addTriple function");
        test.assertIsFunction(instance.removeValue, "Builder requires an removeValue function");
    }
});