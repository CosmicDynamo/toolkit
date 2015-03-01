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
 * @module service.data.Provider
 */
define([
    "dojo/_base/declare",
    "core/data/Cache",
    "core/convert"
], function (declare, Cache, convert) {
    /**
     * @class service.data.Provider
     * @mixes core.data.Cache
     */
    return declare([Cache], {
        runtime: null,
        init: function(config){
            config = config || {};
            this.runtime = config.runtime || "./runtime";

            this._mkDir(this.app().path.resolve(this.runtime));
        },
        get: function(subject){
            var app = this.app();
            var fs = app.file;

            var path = this._calcPath(subject);
            if (fs.existsSync(path)){
                return convert.loadFile(path, "RdfGraph");
            }
            return null;
        },
        persist: function(subject, graph){
            var data = this.namedObject(subject, graph);
            var string = convert(data, "RdfGraph", "application/n-triples");

            var path = this._calcPath(subject);
            return this._mkFile(path, string);
        },
        namedObject: function(rootNode, sourceGraph, destGraph){
            var node = sourceGraph.match(rootNode.toNT(), null, null);
            if (destGraph){
                destGraph.addAll(node);
            } else {
                destGraph = node;
            }

            var provider = this;
            node.forEach(function(triple){
                if (triple.object.isBlank()){
                    provider.namedObject(triple.object, sourceGraph, destGraph);
                }
            });
            return destGraph;
        },
        _calcPath: function(subject){
            var path = this.runtime + subject.toString().replace("file://api/", "/").replace("/id/", "/");
            if (path.endsWith("/new/")){
                path = path.replace("/new", "-new");
            }
            return path.substr(0, path.length - 1) + ".nt";
        },
        _mkFile: function (path, data) {
            var fs = this.app().file;
            console.verbose("Trying to Create File:", path);
            if (!this._mkDir(path, 2)) {
                return false;
            }
            try {
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }

                if (fs.existsSync(path)) {
                    return false;
                }
                fs.writeFileSync(path, data);
                console.verbose("Write Complete:".verbose, path.data);

                return true;
            } catch (ex) {
                console.error("Failed to Write File: ".error, path.info);
                console.error(ex);
            }
            return false;
        },
        _mkDir: function (fullPath, start) {
            var sep = this.app().path.sep;

            var parts = fullPath.split(sep);
            var fs = this.app().file;

            var idx = start || 2;
            try {
                var dir = parts.slice(0, idx).join(sep);
                if (!fs.existsSync(dir)) {
                    console.verbose("Making Directory:".verbose, dir.info);
                    fs.mkdirSync(dir);
                }
            } catch (err) {
                if (err.code != "EEXIST") {
                    console.error("Failed to create Directory:".error, err);
                    return false;
                }
            }

            if (idx < parts.length) {
                return this._mkDir(fullPath, idx + 1);
            }
            return true;
        }
    });
});