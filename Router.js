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
    "core/HandlerHub",
    "service/ontology/jss",
    "RdfJs/ontology/owl",
    "RdfJs/node/Named",
    "blocks/promise/when",
    "RdfJs/ontology/rdf"
], function (declare, HandlerHub, jss, owl, Named, when, rdf) {
    /**
     * @class service.Router
     * @mixes core.HandlerHub
     */
    return declare([HandlerHub], {
        configGraph: "RequestHandlers",
        /** @property {String} */
        handlerType: "http://vocab.cosmicdynamo.net/service.owl#RequestHandler",
        /*init: function () {
            var router = this;
            router.app().messaging.use(router.route.bind(router));
        },*/
        init: function(){
            var router = this;
            var graph = router.app().server.config();


            router.register("/api/", jss("Resource"), "get", "container");
            router.register("/vocab/", owl("Class"), "get", "container");

            var topLevel = router.getParts(graph.match(null, rdf("type").toNT(), jss("UrlPart").toNT()), "subject");

            topLevel.forEach(function(details){
                var url = "/api/" + details.token + "/";

                router.register(url, details.objectType, "post", "container");
                router.register(url, details.objectType, "get", "container");

                router.register(url + "new/", details.objectType, "get", "initial");

                url = "^" + url + "id/*/";
                router.register(url + "$", details.objectType, "get", "instance");
                router.register(url + "$", details.objectType, "put", "instance");
                router.register(url + "$", details.objectType, "patch", "instance");

                var children = router.getParts(graph.match(details.subject.toNT(), jss("hasCollection").toNT(), null), "object");

                children.forEach(function(child){
                    router.register(url + child.token + "/$", child.objectType, "get", "container");
                    router.register(url + child.token + "/$", child.objectType, "post", "container");
                })
            });

        },
        getParts: function(graph, position) {
            var config = this.app().server.config();
            return graph.toArray().map(function(triple){
                return {
                    subject: triple.subject,
                    token: config.match(triple[position].toNT(), jss("token").toNT(), null).toArray()[0].object.valueOf(),
                    objectType: config.match(triple[position].toNT(), jss("objectType").toNT(), null).toArray()[0].object
                }
            });
        },
        register: function(url, objectType, method, logicType){
            var args = {
                handleAs: objectType,
                objectType: objectType,
                noExec: true,
                purpose: method + "-" + logicType
            };
            var hub = this;

            var loading = hub.handle(url, args);

            if (!loading){
                args.handleAs = jss("DefaultRequestHandler");
                loading = hub.handle(url, args);
            }

            if (!loading){
                console.error("No Handler Found", objectType.toNT(), method, logicType);
                return null;
            }

            var express = this.app().messaging;
            when(loading, function(handler){
                express[method](url, function(req, res){
                    var url = hub.app().server.urlToPath(new Named(req.url));

                    handler.handle(url, {
                        objectType: objectType,
                        request: req,
                        response: res
                    });
                });
            }, function(err){
                console.error("Failed to load handler", objectType.toNT(), method, logicType, err.message);
            });
        }
        /**
         * Redirects the request to the correct logic module
         * @param req
         * @param res
         *

        route: function (req, res) {
            var app = this.app();
            var server = app.server;
            var router = this;

            var url = server.urlToPath(new Named(req.url));

            var objectType = server.typeFromUrl(url);
            objectType = objectType || jss("BadRequest-TypeNotSupported");

            console.verbose("Request Identified As Type:".verbose, objectType.toNT().info);

            var purpose = req.method.toLowerCase() + "-";
            if (server.isCollection(url)){
                purpose += "container";
            } else if (server.isNew(url)){
                purpose += "initial-state";
            } else {
                purpose += "instance";
            }

            console.verbose("Request Identified As Purpose:".verbose, purpose.info);

            var args = {
                handleAs: objectType,
                objectType: objectType,
                request: req,
                response: res,
                purpose: purpose
            };

            var custom = router.handle(url, args);

            if (!custom){
                args.handleAs = jss("DefaultRequestHandler");
                return router.handle(url, args);
            }
            return custom;
        }*/
    });
});