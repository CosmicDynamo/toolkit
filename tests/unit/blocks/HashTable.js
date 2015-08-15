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
 * @module $<class>$
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/HashTable"
], function (intern, assert, HashTable) {
    return new intern({
        name: "blocks/HashTable",
        "add: stores object and returns a key": function () {
            var hash = new HashTable();
            
            var value = {
                property: "value"
            };
            var key = hash.add(value);

            assert.notEqual(key, value, "key is not value");
            assert.isString(key, "Key is a string");
            assert.strictEqual(value, hash.get(key), "Get(key) returns original value");
        },
        "lookup: returns key from value": function () {
            var hash = new HashTable();

            var value = {
                property: "value"
            };
            var key = hash.add(value);
            var lookup = hash.lookup(value);

            assert.strictEqual(key, lookup, "Lookup matches original generated key");
        },
        "remove: removes value from table": function () {
            var hash = new HashTable();

            var value = {
                property: "value"
            };
            var key = hash.add(value);
            hash.remove(key);

            assert.isNull(hash.get(key), "get does not return value");
        },
        "remove: removes value from lookup": function () {
            var hash = new HashTable();

            var value = {
                property: "value"
            };
            var key = hash.add(value);
            hash.remove(key);
            var lookup = hash.lookup(value);

            assert.isNull(lookup, "Lookup does not return value");
        },
        "keys: returns list of keys generated from adding values": function(){
            var hash = new HashTable();

            var value = {
                property: "value"
            };
            var key1 = hash.add("value1");
            var key2 = hash.add("value2");
            var key3 = hash.add("value3");
            var key4 = hash.add("value4");
            var key5 = hash.add("value5");

            var match = {};
            hash.keys().forEach(function(key){
                match[key] = true;
            });
            assert.isTrue(match[key1]);
            assert.isTrue(match[key2]);
            assert.isTrue(match[key3]);
            assert.isTrue(match[key4]);
            assert.isTrue(match[key5]);
        },
        "forEach: loops through all stored values": function(){
            var hash = new HashTable();

            var value = {
                property: "value"
            };
            var key1 = hash.add("value1");
            var key2 = hash.add("value2");
            var key3 = hash.add("value3");
            var key4 = hash.add("value4");
            var key5 = hash.add("value5");

            var match = {};
            hash.forEach(function(value, key, self){
                assert.strictEqual(self, hash);
                match[key] = value;
            });
            assert.strictEqual("value1", match[key1]);
            assert.strictEqual("value2", match[key2]);
            assert.strictEqual("value3", match[key3]);
            assert.strictEqual("value4", match[key4]);
            assert.strictEqual("value5", match[key5]);
        },
        "genHash: can pass custom has method": function () {
            var hash = new HashTable({
                genHash: function(){
                    return "custom";
                }
            });

            var value = {
                property: "value"
            };
            var key = hash.add(value);

            assert.notEqual("custom", key, "key is custom value");
        }
    });
});