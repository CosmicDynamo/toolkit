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
 * @module core/converter
 */
define([
    "dojo/_base/lang",
    "blocks/Container",
    "core/require"
], function (lang, Container, require) {
    /**
     * @instance core.converter
     */
    return {
        /** @property {blocks.Container} */
        _parser: new Container(),
        /**
         *
         * @param {Object} config
         * @param {String} [config.type1] - mediaType string
         * @param {String} [config.type2] - mediaType string
         * @param {String} [config.type1-type2] - Module Id when converting from type1 to type2
         * @param {String} [config.type2-type1] - Module Id when converting from type2 to type1
         */
        register: function (config) {
            var keys = Object.keys(config);
            keys.forEach(function (key) {
                if (!key.indexOf("-") > 0) {
                    return;
                }
                var convert = key.split("-");
                var fromType = config[convert[0]];
                var toType = config[convert[1]];

                var from = parser.get(fromType);
                if (from == null) {
                    from = new Container();
                    parser.set(fromType, from);
                }

                from.set(toType, config[key]);
            });
        },
        /**
         * Runs the registered serializer, if able, on the input data
         * @param {String} fromType - mediaType of the input data
         * @param {String} toType - data type of the output
         * @param {*} data - Data to be parsed
         * @return {Promise<*> | null} - data formatted as requested; or null if no parser available
         */
        parse: function (fromType, toType, data) {
            var from = this._parser.get(fromType);
            if (!from) {
                return null;
            }
            var to = from.get(toType);
            if (!to) {
                return null;
            }

            return require([to], function (parser) {
                return parser(data);
            });
        }
    };
});