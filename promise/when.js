define([
	"dojo/_base/Deferred",
    "dojo/_base/lang"
], function(Deferred, lang){
    /**
     * Transparently applies callbacks to values and/or promises.
     * @description Accepts promises but also transparently handles non-promises. If no
     * callbacks are provided returns a promise, regardless of the initial
     * value. Foreign promises are converted.
     *
     * If callbacks are provided and the initial value is not a promise,
     * the callback is executed immediately with no error handling. Returns
     * a promise if the initial value is a promise, or the result of the
     * callback otherwise.
     *
     * @method blocks.promise.when
     * @param {*} valueOrPromise - Either a regular value or an object with a `then()` method that follows the Promises/A specification.
     * @param {Function} [callback] - Callback to be invoked when the promise is resolved, or a non-promise is received
     * @param {function} [errback] - Callback to be invoked when the promise is rejected.
     * @param {Function} [progback] - Callback to be invoked when the promise emits a progress update.
     * @return {Promise | *} Promise, or if a callback is provided, the result of the callback.
     */
	return function (valueOrPromise, callback, errback, progback){
		var receivedPromise = valueOrPromise && lang.isFunction(valueOrPromise.then);

		if(receivedPromise && (callback || errback || progback)) {
            return valueOrPromise.then(callback, errback, progback);
        }

		return callback?callback(valueOrPromise):valueOrPromise;
	};
});
