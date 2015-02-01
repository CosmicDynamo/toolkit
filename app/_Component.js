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
 * @module core.app._Component
 */
define([
    "dojo/_base/declare",
    "./cache",
    "dojo/Stateful",
    "blocks/promise/when",
    "core/convert"
], function (declare, cache, Stateful, when, convert) {
    /**
     * @class core.app._Component
     * @mixes dojo.Stateful
     * @mixes dojo.declare
     */
    return declare([Stateful], {
        /**
         * @property name of the RDF Graph which contains the Hub's configuration data
         * @type {String}
         * */
        configGraph: null,
        /**
         * Returns the active application object
         * @return {core.Application}
         */
        app: function(){
            return cache.get();
        },
        /**
         * Pulls RDF configuration information and puts it into the Components configuration graph
         * @param {Object} [config] - config data to use when prepping this object
         * @return {Promise | null}
         */
        loadConfig: function(config) {
            config = config || {};
            if (!config.load) {
                return null;
            }

            var graph = this.config();
            return when(convert.loadFile(config.load, "RdfGraph"), function (data) {
                graph.addAll(data);
            }, function(err){
                console.error("Failed to load file".error, config.load.data, err.message.info);
            });
        },
        /**
         * Returns the RDF Graph containing configuration data for this Component
         * @return {RdfJs.Graph}
         */
        config: function(){
            return this.app().store.getGraph(this.configGraph, { createIfNotExists: true});
        }
    });
});