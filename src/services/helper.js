/**
 * collection of helper functions
 */
angular.module('trainapp')
    .service('HelperService', [
        function () {
            "use strict";

            /**
             * Check whether given obj
             * @param obj
             * @returns {boolean}
             */
            this.isPromise = function (obj) {
                return obj instanceof Object && typeof obj.then === 'function' && typeof obj.finally === 'function';
            };

            /**
             * Wraps promise with additional information about promise
             * @param promise
             */
            this.wrapPromise = function (promise) {
                var result = {};
                if (this.isPromise(promise)) {
                    result.progress = true;
                    result.finished = false;
                    promise.then(function () {
                        result.progress = false;
                        result.finished = true;
                        result.resolved = true;
                        result.rejected = false;
                    }, function () {
                        result.progress = false;
                        result.finished = true;
                        result.resolved = false;
                        result.rejected = true;
                    });
                }
                return result;
            };
        }
    ]);