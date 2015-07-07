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
 * @module blocks.test.unit.Cache
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/Cache"
], function (intern, assert, Cache) {
    return new intern({
        name: "blocks/Cache",
        "get: calls getter method if key not found": function(){
            var __requestedId = null, __requestedKey = null;

            var cache = new Cache({
                load: function(id, key){
                    __requestedId =id;
                    __requestedKey =key;
                }
            });

            cache.get("anId");

            assert.strictEqual("anId", __requestedId);
            assert.isNotNull("anId", "key matches string value for simple objects");
        },
        "get: returns value from getter": function () {
            var cache = new Cache({
                load: function(){
                    return "expected";
                }
            });

            var actual = cache.get("anId");

            assert.strictEqual("expected", actual);
        },
        "get: only called once; value returned every time": function () {
            var __called = 0;
            var cache = new Cache({
                load: function(){
                    __called++;
                    return "expected";
                }
            });

            var actual = cache.get("anId");
            assert.strictEqual(1, __called);
            assert.strictEqual("expected", actual);

            actual = cache.get("anId");
            assert.strictEqual(1, __called);
            assert.strictEqual("expected", actual);
        },
        "get: Supports Object Ids": function () {
            var __called = 0;
            var cache = new Cache({
                load: function(id){
                    __called++;
                    return id.object.nested;
                }
            });

            var actual = cache.get({
                "one": "somewhere",
                "object": { "nested": "value1" },
                "value": "property"
            });
            assert.strictEqual(1, __called);
            assert.strictEqual("value1", actual);

            actual = cache.get({
                "two": "somewhere",
                "object": { "nested": "value2" },
                "value": "property"
            });
            assert.strictEqual(2, __called);
            assert.strictEqual("value2", actual);

            actual = cache.get({
                "one": "somewhere",
                "value": "property",
                "object": { "nested": "value1" }
            });
            assert.strictEqual(2, __called);
            assert.strictEqual("value1", actual);

            actual = cache.get({
                "two": "somewhere",
                "value": "property",
                "object": { "nested": "value2" }
            });
            assert.strictEqual(2, __called);
            assert.strictEqual("value2", actual);
        },
        "get: different key will cause getter to be called": function () {
            var __called = 0;
            var cache = new Cache({
                load: function(id){
                    __called = __called || [];
                    __called.push(id);
                    return id;
                }
            });
            
            cache.get("id1");
            cache.get("id2");

            assert.strictEqual(2, __called.length);

            assert.strictEqual("id1", __called[0]);
            assert.strictEqual("id2", __called[1]);
        },
        "get: null return will prevent caching": function () {
            var __called = 0;
            var cache = new Cache({
                load: function(){
                    __called++;
                    return null;
                }
            });

            var actual = cache.get("anId");
            assert.strictEqual(1, __called);
            assert.isNull(actual);

            actual = cache.get("anId");
            assert.strictEqual(2, __called);
            assert.isNull(actual);

            cache.get("anId");
            assert.strictEqual(3, __called);
        },
        "remove: will clear a value from the cache": function(){
            var __called = 0;
            var cache = new Cache({
                load: function(){
                    return __called++;
                }
            });
            var key = "The Key";

            assert.strictEqual(0, cache.get(key));
            assert.strictEqual(0, cache.get(key));

            cache.remove(key);

            assert.strictEqual(1, cache.get(key));
        }
    });
});