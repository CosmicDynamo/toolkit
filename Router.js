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
        init: function(){
            var router = this;
            var graph = router.app().server.config();


            router.register("/api/", {
                objectType: jss("Resource"),
                predicate: jss("hasResource")
            }, "get", "container");
            router.register("/vocab/", {
                objectType: owl("Class"),
                predicate: jss("servesClass")
            }, "get", "container");

            var topLevel = router.getParts(graph.match(null, rdf("type").toNT(), jss("UrlPart").toNT()), "subject");

            topLevel.forEach(function(details){
                var url = "/api/" + details.token + "/";

                router.register(url, details, "post", "container");
                router.register(url, details, "get", "container");

                router.register(url + "new/", details, "get", "template");

                url = "^" + url + "id/*/";
                router.register(url + "$", details, "get", "instance");
                router.register(url + "$", details, "put", "instance");
                router.register(url + "$", details, "patch", "instance");

                var children = router.getParts(graph.match(details.subject.toNT(), jss("hasCollection").toNT(), null), "object");

                children.forEach(function(child){
                    router.register(url + child.token + "/$", child, "get", "container");
                    router.register(url + child.token + "/$", child, "post", "container");

                    router.register(url + child.token + "new/$", details, "get", "template");
                });
            });

        },
        getParts: function(graph, position) {
            var router = this;
            var config = this.app().server.config();
            return graph.toArray().map(function(triple){
                var subject = triple[position];
                return {
                    subject: triple.subject,
                    token: router._object(subject, jss("token"), config).valueOf(),
                    objectType: router._object(subject, jss("objectType"), config),
                    predicate: router._object(subject, jss("predicate"), config)
                }
            });
        },
        _object: function(subject, predicate, graph){
            return graph.match(subject.toNT(), predicate.toNT(), null).toArray().map(function(triple){
                return triple.object;
            })[0];
        },
        register: function(url, urlPart, method, logicType){
            var args = {
                handleAs: urlPart.objectType,
                objectType: urlPart.objectType,
                predicate: urlPart.predicate,
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
                console.error("No Handler Found", urlPart.objectType.toNT(), method, logicType);
                return null;
            }

            var express = this.app().messaging;
            when(loading, function(handler){
                express[method](url, function(req, res){
                    var url = hub.app().server.urlToPath(new Named(req.url));

                    handler.handle(url, {
                        predicate: urlPart.predicate,
                        objectType: urlPart.objectType,
                        request: req,
                        response: res
                    });
                });
            }, function(err){
                console.error("Failed to load handler", urlPart.objectType.toNT(), method, logicType, err.message);
            });
        }
    });
});