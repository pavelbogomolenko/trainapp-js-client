angular.module('trainapp')
    .factory('BaseResource', [
        '$resource',
        'appConfig',
        function($resource, appConfig) {
            "use strict";

            /**
             * Base for any resource in application
             *
             * @constructor
             */
            function BaseResource (resourceName) {
                if(resourceName === '') {
                    throw 'resourceName is not set!'
                }
                this.resource = $resource(appConfig.apiPrefix + resourceName);
            }

            /**
             * Creates empty resource object
             * @returns {this.resource}
             */
            BaseResource.prototype.getResourceEntity = function() {
                return new this.resource();
            };

            /**
             * Method used to simplify prototype inheritance
             *
             * @param target
             * @param source
             */
            BaseResource.inherit = function(target, source) {
                target.prototype = Object.create(source.prototype);
                target.prototype.constructor = target;
                target.parent = source;
            };

            return BaseResource;
        }
    ]);