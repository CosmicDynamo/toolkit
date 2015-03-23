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
 * @module RdfJs.test.api.Node
 */
define([
], function () {
    /**
     * @method RdfJs.test.api.Node
     * @param {*} instance
     * @param {qasht.Test} test
     */
    return function (instance, test) {
        test.assertIsObject(instance, "RDF Node must be an Object");

        test.assertIsString(instance.nominalValue, "RDF Node nominalValue MUST be a String");
        test.assertIsString(instance.interfaceName, "RDF Node interfaceName MUST be a String");

        test.assertIsFunction(instance.toString, "RDF Node API requires a toString method");
        test.assertIsFunction(instance.valueOf, "RDF Node API requires a valueOf method");
        test.assertIsFunction(instance.toNT, "RDF Node API requires a toNT method");
        test.assertIsFunction(instance.equals, "RDF Node API requires an equals method");
        test.assertIsFunction(instance.isBlank, "RDF Node API requires an isBlank method");
        test.assertIsFunction(instance.isNamed, "RDF Node API requires an isNamed method");
        test.assertIsFunction(instance.isLiteral, "RDF Node API requires an isLiteral method");
        test.assertIsFunction(instance.isLiteral, "RDF Node API requires an isLiteral method");
    }
});