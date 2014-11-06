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
 * @module blocks.test.unit.Cache
 */
define([
    "qasht/package/Unit",
    "blocks/Cache"
], function (TestPackage, Cache) {
    return new TestPackage({
        module: "blocks/Cache",
        tests: [
            {
                name: "get: calls getter method if key not found",
                load: function(id){
                    this.__requestedId =id;
                },
                exec: function (test) {
                    test.cache.get("anId");

                    test.assertEqual("anId", test.cache.__requestedId);

                    test.complete();
                }
            },
            {
                name: "get: returns value from getter",
                load: function(){
                    return "expected";
                },
                exec: function (test) {
                    var actual = test.cache.get("anId");

                    test.assertEqual("expected", actual);

                    test.complete();
                }
            },
            {
                name: "get: only called once; value returned every time",
                load: function(){
                    this.__called++;
                    return "expected";
                },
                exec: function (test) {
                    test.cache.__called = 0;
                    var actual = test.cache.get("anId");
                    test.assertEqual(1, test.cache.__called);
                    test.assertEqual("expected", actual);

                    actual = test.cache.get("anId");
                    test.assertEqual(1, test.cache.__called);
                    test.assertEqual("expected", actual);

                    test.complete();
                }
            },
            {
                name: "get: Supports Object Ids",
                load: function(id){
                    this.__called++;
                    return id.object.nested;
                },
                exec: function (test) {
                    test.cache.__called = 0;
                    var actual = test.cache.get({
                        "one": "somewhere",
                        "object": { "nested": "value1" },
                        "value": "property"
                    });
                    test.assertEqual(1, test.cache.__called);
                    test.assertEqual("value1", actual);

                    actual = test.cache.get({
                        "two": "somewhere",
                        "object": { "nested": "value2" },
                        "value": "property"
                    });
                    test.assertEqual(2, test.cache.__called);
                    test.assertEqual("value2", actual);

                    actual = test.cache.get({
                        "one": "somewhere",
                        "value": "property",
                        "object": { "nested": "value1" }
                    });
                    test.assertEqual(2, test.cache.__called);
                    test.assertEqual("value1", actual);

                    actual = test.cache.get({
                        "two": "somewhere",
                        "value": "property",
                        "object": { "nested": "value2" }
                    });
                    test.assertEqual(2, test.cache.__called);
                    test.assertEqual("value2", actual);

                    test.complete();
                }
            },
            {
                name: "get: different key will cause getter to be called",
                load: function(value){
                    this.__called = this.__called || [];
                    this.__called.push(value);
                    return value;
                },
                exec: function (test) {
                    test.cache.get("id1");
                    test.cache.get("id2");

                    test.assertEqual(2, test.cache.__called.length);

                    test.assertEqual("id1", test.cache.__called[0]);
                    test.assertEqual("id2", test.cache.__called[1]);


                    test.complete();
                }
            },
            {
                name: "get: null return will prevent caching",
                load: function(){
                    this.__called++;
                    return null;
                },
                exec: function (test) {
                    test.cache.__called = 0;

                    var actual = test.cache.get("anId");
                    test.assertEqual(1, test.cache.__called);
                    test.assertNull(actual);

                    actual = test.cache.get("anId");
                    test.assertEqual(2, test.cache.__called);
                    test.assertNull(actual);

                    test.cache.get("anId");
                    test.assertEqual(3, test.cache.__called);

                    test.complete();
                }
            },
        ],
        setUp: function (test) {
            test.cache = new Cache({
                load: test.load
            })
        }
    });
});