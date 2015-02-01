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

            var path = this.runtime + subject.toString().replace("file://api/", "/").replace("/id/", "/");
            path = path.substr(0, path.length - 1) + ".nt";
            if (fs.existsSync(path)){
                return convert.loadFile(path, "RdfGraph");
            }
            return null;
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