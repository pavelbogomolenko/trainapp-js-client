/**
 * collection of helper functions
 */
angular.module('trainapp')
    .service('HelperService', [
        function () {
            "use strict";

            /**
             * Check whether given obj is promise
             *
             * @param obj
             * @returns {boolean}
             */
            this.isPromise = function (obj) {
                return typeof obj.then === 'function';
            };

            /**
             * Enrich response with additional status attributes
             *
             * @param promise
             * @returns {{}}
             */
            this.extendPromise = function (promise, result) {
                result = result instanceof Object ? result : {};
                if (this.isPromise(promise)) {
                    result.loading = true;
                    result.loaded = false;
                    promise.then(function (response) {
                        result.loading = false;
                        result.loaded = true;
                        result.success = true;
                        window.console && window.console.log(result);
                    }, function (errorResponse) {
                        result.loading = false;
                        result.loaded = true;
                        result.success = false;
                        result[errorResponse.status] = true;
                    });
                }
                return result;
            };
        }
    ]);