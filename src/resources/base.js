angular.module('trainapp')
    .factory('BaseResource', [
        '$resource',
        'appConfig',
        function($resource, appConfig) {
            "use strict";

            /**
             *
             * @constructor
             */
            function BaseResource (resourceName) {
                window.console && window.console.log(resourceName);
                if(resourceName === '') {
                    throw 'resourceName is not set!'
                }
                this.resource = $resource(appConfig.apiPrefix + resourceName);
            }

            BaseResource.prototype.getNewResource = function() {
                window.console && window.console.log('call getNewResource', this);
                return new this.resource();
            };

            BaseResource.inherit = function(target, source) {
                target.prototype = Object.create(source.prototype);
                target.prototype.constructor = target;
                target.parent = source;
            };

            return BaseResource;
        }
    ]);