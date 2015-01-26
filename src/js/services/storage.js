/**
 * simplified implementation of localStorage with fallback to in-memory object storage
 */
angular.module('trainapp')
    .service('StorageService', [
    '$window',
    function ($window) {
        "use strict";

        var isSupported = ('localStorage' in $window && $window['localStorage'] !== null),
            localStorage;

        if (isSupported) {
            localStorage = $window['localStorage'];
        } else {
            localStorage = {
                setItem: function (k, v) {
                    localStorage[k] = v;
                },
                getItem: function (k) {
                    return typeof(localStorage[k]) != 'undefined' ? localStorage[k] : null
                },
                removeItem: function (k) {
                    delete localStorage[k];
                },
                clear: function () {
                    for (var k in localStorage) {
                        if (localStorage.hasOwnProperty[k]) {
                            delete localStorage[k];
                        }
                    }
                }
            };
        }

        /**
         * Add element to storage.
         *
         * @param string key
         * @param mixed value
         */
        this.set = function (key, value) {
            localStorage.setItem(key, angular.toJson(value));
        };

        /**
         * Get element by key from storage
         * Returns null value when
         *
         * @param string key
         * @return mixed|null
         */
        this.get = function (key, defValue) {
            var value = localStorage.getItem(key);
            return value ? angular.fromJson(value) : defValue;
        };

        /**
         * Remove by key
         */
        this.remove = function (key) {
            localStorage.removeItem(key);
        };

        /**
         * Clear all
         */
        this.clear = function () {
            localStorage.clear();
        };
    }
]);