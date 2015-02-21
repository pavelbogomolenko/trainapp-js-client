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
                var resourceName = 'program';
                ProgramResource.parent.call(this, resourceName, '?id=:id');
            }

            ProgramResource.prototype.getOneById = function (id) {
                return this.query({ id: id });
            };

            ProgramResource.prototype.list = function () {
                return this.query();
            };

            ProgramResource.prototype.add = function (entity) {
                return this.save(entity);
            };

            return new ProgramResource();
        }
    ]);