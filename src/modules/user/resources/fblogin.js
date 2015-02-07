angular.module('trainapp.user')
    .factory('FbloginResource', [
        'BaseResource',
        function(BaseResource) {
            "use strict";

            /**
             * inherit from BaseResource
             */
            BaseResource.inherit(FbloginResource, BaseResource);

            /**
             *
             * @constructor
             */
            function FbloginResource() {
                var resourceName = 'fblogin';
                FbloginResource.parent.call(this, resourceName);
            }

            FbloginResource.prototype.fblogin = function (email) {
                var resourceEntity = this.getResourceEntity();
                resourceEntity.email = email;
                return this.resource.save(resourceEntity);
            };

            return new FbloginResource();
        }
    ]);