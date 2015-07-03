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
 *
 * @module polyfill.has
 */
define([
], function () {
    var global = this;
    /**
     * @instance polyfill.has
     */
    return {
        /**
         *  Conditional loading of AMD modules based on a has feature test value.
         *  @param {String} id - Gives the resolved module id to load.
         *  @param {Function} parentRequire -  The loader require function with respect to the module that contained the plugin resource in it's dependency list.
         *  @param {Function} loaded - Callback to loader that consumes result of plugin demand.
         */
        load: function (id, parentRequire, loaded) {
            var parts = id.split(".");

            var Ctor = global[parts[0]];
            if (Ctor == null) {
                return parentRequire(["polyfill/" + parts.join("/")], loaded);
            }
            else if (parts[1] && Ctor.prototype[parts[1]] == undefined) {
                return parentRequire(["polyfill/" + parts.join("/")], loaded);
            }
            return loaded();
        }
    };
});