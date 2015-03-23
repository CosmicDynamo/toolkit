/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "blocks/Container"
], function (declare, lang, Container) {
    /* Base Class to minimize redundant code when implementing RDF PrefixMap and TermMap */
    /**
     * @class RdfJs._Map
     * @mixes blocks.Container
     */
    return declare([Container], {
        get: function (alias) {
            this.isValid(alias);

            return this.inherited(arguments);
        },
        set: function (alias, expanded) {
            this.isValid(alias);

            return this.inherited(arguments);
        },
        isValid: function (alias) {
            return alias.indexOf(" ") == -1;
        },
        addAll: function (values, override) {
            var map = this;
            values.keys().forEach(function (term) {
                if (override || map.get(term) === undefined) {
                    map.set(term, map.values[term]);
                }
            });

            return this;
        }
    });
});