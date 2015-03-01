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
 * @module service.handler.request._Put
 */
define([
    "dojo/_base/declare",
    "../_Request",
    "../_ResponseBody",
    "../_RequestBody",
    "service/ontology/jss",
    "RdfJs/node/Literal",
    "RdfJs/ontology/xsd",
    "RdfJs/ontology/rdf",
    "blocks/promise/when"
], function (declare, _Request, _ResponseBody, _RequestBody, jss, Literal, xsd, rdf, when) {
    /**
     * Base class for GET requests
     * @class service.handler.request._Get
     * @mixes service.handler._Request
     * @override service.handler._Request#handle
     */
    return declare([_Request, _ResponseBody, _RequestBody], {
        constructor: function(){
            this.expandStep("load",
                "parseRequest",
                "preValidation",
                "validate",
                "postValidation",
                "persist"
            );
        },
        preValidation: function(args){
            args.builder.removeLinks();
        },
        validate: function(args){
            return when(this.app().ontology.validate({
                instance: args.builder,
                objectType: args.objectType
            }), function(pass){
                if (pass === false){
                    handler.setStatus(args, 400);
                    handler.skipTo(args, "formatResponse");
                }
            });
        },
        postValidation: function(args){
            var data = args.builder;

            data.clear(rdf("type"))
                .setValue(jss("updatedOn"), new Literal((new Date()).toISOString(), null, xsd("date")));
        },
        persist: function(args){
            this.app().data.persist(args.builder.subject, args.builder.graph());
        }
    });
});