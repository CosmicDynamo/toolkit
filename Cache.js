/**
 * Somehow this file was overwritten withthat in HashTable, and it appears to have happended during one of my git repository refactor efforts so I cannot find any of the original source
 * TODO: put this back togeter
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./Container"
], function (declare, lang, Container) {
    /**
     * Supposed to be a module for handling the caching of data requests so that if an entry is not defined it will call an
     * input get method your code can override
     */
    return declare([Container], {
        _pointer: null,
        _empty: null,
        constructor: function (parent, fnName) {
            this.parent = parent;
            this.fnName = fnName;

            if (parent.getObjectId) {
                this.getObjectId = parent.getObjectId;
            }
        },
        /**
         * Gets a value
         * @param {String} name
         * @return {*} value
         */
        get: function (name) {
            arguments[0] = this.getObjectId(name);

            var val = this.inherited(arguments);
            if (val === null) {
                return this.parent[this.fnName](name);
            }
        },
        /**
         * Sets a value
         * @param {String} name
         * @param {*} value
         */
        set: function (name, value) {
            arguments[0] = this.getObjectId(name);

            this.inherited(arguments)
        },
        /**
         * Creates a Hash from an input object
         * @description Intended to be overridden by more complex Caches
         * @param {String} name
         * @return {String}
         */
        getObjectId: function (name) {
            return name;
        }
    })
});
