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
 * @module jazzHands.test.fake.rdf._TripleFilter
 */
define([
    "dojo/_base/declare",
    "qasht/_Fake",
    "rdfjs/_TripleFilter"
], function (declare, _Fake, _TripleFilter) {
    /**
     * @class jazzHands.test.fake.rdf._TripleFilter
     * @mixes qasht.test
     * @implements jazzHands.rdf._TripleFilter
     */
    var Filter = declare([_Fake, _TripleFilter], {

    });

    /**
     * @method jazzHands.test.fake.rdf._TripleFilter#testApi
     * @param {*} object - The object being tested
     * @param {qasht.type._Test} test - The test instance being executed
     */
    Filter.testApi = function (object, test) {
        test.assertIsObject(object);

        test.assertIsFunction(object.test);
    };

    return Filter;
});