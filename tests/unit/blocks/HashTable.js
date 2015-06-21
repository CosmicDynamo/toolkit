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
    "qasht/package/Unit",
    "blocks/HashTable"
], function (TestPackage, HashTable) {
    return new TestPackage({
        module: "blocks/HashTable",
        tests: [
            {
                name: "add: stores object and returns a key",
                exec: function (test) {
                    var value = {
                        property: "value"
                    };
                    var key = test.hash.add(value);

                    test.assertNotEqual(key, value, "key is not value");
                    test.assertIsString(key, "Key is a string");
                    test.assertEqual(value, test.hash.get(key), "Get(key) returns original value");

                    test.complete();
                }
            },
            {
                name: "lookup: returns key from value",
                exec: function (test) {
                    var value = {
                        property: "value"
                    };
                    var key = test.hash.add(value);
                    var lookup = test.hash.lookup(value);

                    test.assertEqual(key, lookup, "Lookup matches original generated key");

                    test.complete();
                }
            },
            {
                name: "remove: removes value from table",
                exec: function (test) {
                    var value = {
                        property: "value"
                    };
                    var key = test.hash.add(value);
                    test.hash.remove(key);

                    test.assertUndefined(test.hash.get(key), "get does not return value");

                    test.complete();
                }
            },
            {
                name: "remove: removes value from lookup",
                exec: function (test) {
                    var value = {
                        property: "value"
                    };
                    var key = test.hash.add(value);
                    test.hash.remove(key);
                    var lookup = test.hash.lookup(value);

                    test.assertUndefined(lookup, "Lookup does not return value");

                    test.complete();
                }
            },
            {
                name: "keys: returns list of keys generated from adding values",
                exec: function(test){
                    var value = {
                        property: "value"
                    };
                    var key1 = test.hash.add("value1");
                    var key2 = test.hash.add("value2");
                    var key3 = test.hash.add("value3");
                    var key4 = test.hash.add("value4");
                    var key5 = test.hash.add("value5");

                    var match = {};
                    test.hash.keys().forEach(function(key){
                        match[key] = true;
                    });
                    test.assertTrue(match[key1]);
                    test.assertTrue(match[key2]);
                    test.assertTrue(match[key3]);
                    test.assertTrue(match[key4]);
                    test.assertTrue(match[key5]);

                    test.complete();
                }
            },
            {
                name: "forEach: loops through all stored values",
                exec: function(test){
                    var value = {
                        property: "value"
                    };
                    var key1 = test.hash.add("value1");
                    var key2 = test.hash.add("value2");
                    var key3 = test.hash.add("value3");
                    var key4 = test.hash.add("value4");
                    var key5 = test.hash.add("value5");

                    var match = {};
                    test.hash.forEach(function(value, key, self){
                        test.assertEqual(self, test.hash);
                        match[key] = value;
                    });
                    test.assertEqual("value1", match[key1]);
                    test.assertEqual("value2", match[key2]);
                    test.assertEqual("value3", match[key3]);
                    test.assertEqual("value4", match[key4]);
                    test.assertEqual("value5", match[key5]);

                    test.complete();
                }
            },
            {
                name: "genHash: can pass custom has method",
                setUp: function(test){
                    test.hash = new HashTable({
                        genHash: function(){
                            return "custom";
                        }
                    })
                },
                exec: function (test) {
                    var value = {
                        property: "value"
                    };
                    var key = test.hash.add(value);

                    test.assertNotEqual("custom", key, "key is custom value");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.hash = new HashTable();
        }
    });
});