define([], function () {
    return {
        /**
         *  Conditional loading of AMD modules based on a has feature test value.
         *  @param {String} id - Gives the resolved module id to load.
         *  @param {Function} parentRequire -  The loader require function with respect to the module that contained the plugin resource in it's dependency list.
         *  @param {Function} loaded - Callback to loader that consumes result of plugin demand.
         */
        load: function (id, parentRequire, loaded) {
            id = id || "blocks/string/lang/uca/common";
            if (!id.indexOf("/") > -1) {
                id = "blocks/string/lang/" + id.replace("_", "/");
            }
            return parentRequire([id], loaded);
        }
    };
});