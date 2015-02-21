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
            function BaseResource (resourceName, params) {
                if(resourceName === '') {
                    throw 'resourceName is not set!';
                }
                this.resourceName = resourceName;
                this.params = params;
                var fullResourceName = params !== '' ? this.resourceName + '/' + this.params : this.resourceName;
                this.resource = $resource(appConfig.apiPrefix + fullResourceName);
            }

            /**
             * Creates empty resource object
             * @returns {this.resource}
             */
            BaseResource.prototype.getResourceEntity = function() {
                return new this.resource();
            };

            /**
             * save entity
             *
             * @param entity
             * @returns {*}
             */
            BaseResource.prototype.save = function (entity) {
                var resourceEntity = this.getResourceEntity();
                angular.extend(resourceEntity, entity || {});
                return this.resource.save(resourceEntity);
            };

            /**
             * Triggers get request and expect response data to be array
             * @param queryObject
             * @returns {*}
             */
            BaseResource.prototype.query = function (queryObject) {
                return this.resource.query(queryObject || {});
            };

            /**
             * Triggers get request and expect response data to be object
             * @param queryObject
             * @returns {*}
             */
            BaseResource.prototype.get = function (queryObject) {
                return this.resource.get(queryObject || {});
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