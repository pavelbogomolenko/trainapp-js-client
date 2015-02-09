angular.module('trainapp.program')
    .factory('ProgramResource', [
        'BaseResource',
        function(BaseResource) {
            "use strict";

            /**
             * inherit from BaseResource
             */
            BaseResource.inherit(ProgramResource, BaseResource);

            /**
             *
             * @constructor
             */
            function ProgramResource() {
                var resourceName = 'program/?id=:id';
                ProgramResource.parent.call(this, resourceName);
            }

            ProgramResource.prototype.getOneById = function (id) {
                return this.resource.query({ id: id });
            };

            ProgramResource.prototype.list = function () {
                return this.resource.query();
            };

            ProgramResource.prototype.add = function (entity) {
                var resourceEntity = this.getResourceEntity();
                angular.extend(resourceEntity, entity);
                return this.resource.save(resourceEntity);
            };

            return new ProgramResource();
        }
    ]);