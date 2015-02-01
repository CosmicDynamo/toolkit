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
    "blocks/Cache",
    "blocks/Container",
    "blocks/require",
    "./header/accept"
], function (lang, Cache, Container, require, parseAccept) {
    var parsers = new Cache({
        load: function(){
            return new Container();
        }
    });
    var fileExt = new Container();
    /**
     * Runs the registered serializer, if able, on the input data
     * @param {String} fromType - mediaType of the input data
     * @param {String} accept - data type of the output
     * @param {*} data - Data to be parsed
     * @param {Object} [options] - params to use when converting the data
     * @return {Promise<*> | null} - data formatted as requested; or null if no parser available
     */
    function convert(data, fromType, accept, options) {
        var parts = fromType.split(";");

        var from = parsers.get(parts[0]);

        var toType = parseAccept(from.keys(), accept);
        if (!toType){
            return null;
        }

        var to = from.get(toType.mimeType);
        if (!to) {
            return null;
        }

        return require([to], function (parse) {
            var options = options || {};
            lang.mixin(options, toType);

            if (parts[1]){
                parts[1].split(",").map(function(params){
                    return params.split("=");
                }).forEach(function(param){
                    options[param[0].trim()] = param[1].trim()
                });
            }

            return parse(data, options);
        });
    }
    /**
     * Registers converters using the provided moduleIds
     * @param {Object} config
     * @param {String} [config.type1] - mediaType string
     * @param {String} [config.type2] - mediaType string
     * @param {String} [config.type1-type2] - Module Id when converting from type1 to type2
     * @param {String} [config.type2-type1] - Module Id when converting from type2 to type1
     */
    convert.register = function (config) {
        this._parseConfig(config, function(info){
            parsers.get(info.from).set(info.to, info.use);
        });
    };
    /**
     * Registers a file extension to a specific mime type
     * @param {String} ext - file extension
     * @param {String} mimeType - mime type
     */
    convert.registerExtension = function(ext, mimeType){
        fileExt.set(ext, mimeType);
    };

    /**
     * Removes a registered convert
     * @param {Object} config
     * @param {String} [config.type1] - mediaType string
     * @param {String} [config.type2] - mediaType string
     * @param {String} [config.type1-type2] - Module Id when converting from type1 to type2
     * @param {String} [config.type2-type1] - Module Id when converting from type2 to type1
     */
    convert.deregister = function (config) {
        this._parseConfig(config, function(info){
            parsers.get(info.from).remove(info.to);
        });
    };
    /**
     * Loops through a config object running the input function
     * @param {Object} config
     * @param {String} [config.type1] - mediaType string
     * @param {String} [config.type2] - mediaType string
     * @param {String} [config.type1-type2] - Module Id when converting from type1 to type2
     * @param {String} [config.type2-type1] - Module Id when converting from type2 to type1
     * @param {Function} fn - function to execute
     * @private
     */
    convert._parseConfig = function(config, fn){
        var keys = Object.keys(config);
        keys.filter(function(key){return key.indexOf("-") > 0;})
            .map(function(key){
                var convert = key.split("-");
                return {
                    from: config[convert[0]],
                    to: config[convert[1]],
                    use: config[key]
                }
            }).forEach(fn);
        keys.filter(function(key){ return key[0] === "."})
            .forEach(function(key) {
                convert.registerExtension(key, config[config[key]]);
            });
    };

    /**
     * Loads a file directly to the target format
     * @param {String} fileName - File to be loaded
     * @param {String} to - destination format/mimeType
     * @param {Object} [options] - params to use when converting the data
     * @return {Promise<*>}
     */
    convert.loadFile = function(fileName, to, options){
        var from = fileExt.get(fileName.substr(fileName.lastIndexOf(".")));
        return require(["dojo/text!" + fileName], function(data) {
            return convert(data, from, to, options)
        });
    };

    return convert;
});