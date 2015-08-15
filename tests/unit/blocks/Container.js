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
 * @module blocks.test.unit.Container
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/Container"
], function (intern, assert, Container) {
    return new intern({
        name: "blocks/Container",
        "get/set: Able to set a value and re-get it": function () {
            var container = new Container();
            
            var v1 = "A String";
            var v2 = { an: "Object"};

            assert.isNull(container.get("field1"), "Does not have a value before it is set");
            assert.isNull(container.get("field2"), "Does not have a value before it is set");

            container.set("field1", v1);
            container.set("field2", v2);

            assert.strictEqual(v1, container.get("field1"), "Is now set to new value");
            assert.strictEqual(v2, container.get("field2"), "Is now set to new value");
        },
        "keys: returns the list of names in this Container": function () {
            var container = new Container();

            assert.strictEqual(0, container.keys().length, "Returns empty array before data is added");

            container.set("aColumn1", "value");
            container.set("aColumn2", "value");
            container.set("aColumn3", "value");
            container.set("aColumn4", "value");
            container.set("aColumn4", "SetAgain");

            var columns = container.keys();

            assert.strictEqual(4, columns.length, "Four Values were added");
            var values = {};
            columns.forEach(function (name) {
                values[name] = true;
            });

            assert.isTrue(values["aColumn1"], "Expected value Found");
            assert.isTrue(values["aColumn2"], "Expected value Found");
            assert.isTrue(values["aColumn3"], "Expected value Found");
            assert.isTrue(values["aColumn4"], "Expected value Found");
        }
    });
});