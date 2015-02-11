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
            this.wrapPromise = function (promise) {
                var result = {};
                if (this.isPromise(promise)) {
                    result.loading = true;
                    result.loaded = false;
                    promise.then(function () {
                        result.loading = false;
                        result.loaded = true;
                        result.success = true;
                        result[200] = true;
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