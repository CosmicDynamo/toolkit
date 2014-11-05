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
 * @module service.Router
 */
define([
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "core/converter",
    "blocks/promise/Queue",
    "service/Response",
    "dojo/when",
    "jazzHands/sparql",
    "core/require"
], function (declare, Deferred, converter, Queue, Response, when, sparql, require) {
    /**
     * @class service.Router
     */
    return declare([], {
        init: function () {
            var server = config.app.server;

            server.use(this.route);
        },
        /**
         * Redirects the request to the correct logic module
         * @param req
         * @param res
         */
        route: function (req, res) {
            var queue = new Queue(this);

            queue.enqueue(function () {
                var loaded = new Deferred();
                var data = new Buffer('');
                response.request.on('data', function (chunk) {
                    data = Buffer.concat([data, chunk]);
                });
                response.request.on('end', function () {
                    var response = new Response(req, res);
                    response.rawBody = data;
                    loaded.resolve(response);
                });
                return loaded;
            });

            queue.enqueue(this.parseBody);
            queue.enqueue(this.runLogic);
            queue.enqueue(this.buildResponse);

            queue.enqueue(function (response) {
                response.write();
            });

            return queue.last;
        },
        /**
         * Converts the Request Body into a format understood by our system
         * @param {server.Response} response
         */
        parseBody: function (response) {
            if (!response.rawBody || response.statusCode) {
                return response;
            }

            var cType = req.headers["Content-Type"];
            if (cType === null) {
                return response.exception(0);
            }
            return when(converter.parse(cType, "RdfGraph", req.rawBody), function (out) {
                response.body = out || req.rawBody;
            }, function (error) {
                return response.exception(2, error.message);
            });
        },
        /**
         * Loads the proper Logic module and has it handle the request
         * @param {server.Response} response
         */
        runLogic: function (response) {
            var query = "SELECT ?moduleId" +
                "FROM NAMED <logic>" +
                "WHERE {" +
                "  ?logic a :Method ;" +
                "         :handlesType ?dataType ;" +
                "         :method '" + response.request.method.toUpperCase() + "' ." +
                "  OPTIONAL { ?logic :isDefault ?isDefault )" +
                "  FILTER (?dataType = TypeIri || ?isDefault)" +
                "}";
            return when(sparql(query, this.app.store), function (results) {
                if (results.length === 0) {
                    return response.exception(3);
                }
                return require(results[0].moduleId, function (module) {
                    return module.process(response);
                });
            });
        },
        /**
         * Formats the response according the the Accept header; sets headers; and sends the response
         * @param {server.Response} response
         */
        buildResponse: function (response) {
            var data = response.store.getGraph(response.graphName);
            return when(converter.parse("RdfGraph", response.request.headers["Accept"], data), function (results) {
                response.output = results;
                return response;
            });
        }
    });
});