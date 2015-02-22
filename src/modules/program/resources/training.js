angular.module('trainapp.program')
    .factory('TrainingResource', [
        'BaseResource',
        function(BaseResource) {
            "use strict";

            /**
             * inherit from BaseResource
             */
            BaseResource.inherit(TrainingResource, BaseResource);

            /**
             *
             * @constructor
             */
            function TrainingResource() {
                var resourceName = 'training';
                TrainingResource.parent.call(this, resourceName, '?programId=:programId');
            }

            TrainingResource.prototype.getLastByProgramId = function (programId) {
                return this.query({ programId: programId });
            };

            TrainingResource.prototype.create = function (entity) {
                return this.save(entity);
            };

            return new TrainingResource();
        }
    ]);