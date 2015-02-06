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

                ProgramResource.parent.call(this, resourceName);
            }

            ProgramResource.prototype.list = function () {
                return this.resource.query();
            };

            return new ProgramResource();
        }
    ]);