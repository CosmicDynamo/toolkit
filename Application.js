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
 * @module service.Application
 */
define([
    "dojo/_base/declare",
    "core/Application",
    "./Router",
    "./Server",
    "core/convert",
    "service/data/Provider",
    "service/Permission",
    "service/Ontology"
], function (declare, Application, Router, Server, convert, Provider, Permission, Ontology) {
    /**
     * @class service.Application
     * @mixes core.Application
     */
    return declare([Application], {
        /**
         * @property
         * @type {service.config}
         */
        config: null,
        /**
         * @property
         * @type {service.Router}
         */
        router:null,
        /**
         * @property
         * @type {service.data.Provider}
         */
        data:null,
        /**
         * @property
         * @type {service.Server}
         */
        server:null,
        /**
         * @property
         * @type {service.Permission}
         */
        permission: null,
        /**
         * @property
         * @type {service.Ontology}
         */
        ontology: null,
        constructor: function (params) {
            this.components = this.components.concat(["router", "server", "permission", "ontology", "data"]);
            //noinspection JSValidateTypes
            this.router = new Router();
            //noinspection JSValidateTypes
            this.server = new Server();
            //noinspection JSValidateTypes
            this.data = new Provider();
            //noinspection JSValidateTypes
            this.permission = new Permission();
            //noinspection JSValidateTypes
            this.ontology = new Ontology();

            this.file = params.file;
            this.path = params.path;
            this.messaging = params.server;

            var converters = this.config.converter;
            if (converters) {
                convert.register(converters);
            }
        }
    });
});