angular.module('trainapp.user')
    .factory('WebsiteLoginResource', [
        'BaseResource',
        function(BaseResource) {
            "use strict";

            /**
             * inherit from BaseResource
             */
            BaseResource.inherit(WebsiteLoginResource, BaseResource);

            /**
             *
             * @constructor
             */
            function WebsiteLoginResource() {
                var resourceName = 'login';
                WebsiteLoginResource.parent.call(this, resourceName);
            }

            WebsiteLoginResource.prototype.login = function (email, password) {
                var resourceEntity = this.getResourceEntity();
                resourceEntity.email = email;
                resourceEntity.password = password;
                return this.resource.save(resourceEntity);
            };

            return new WebsiteLoginResource();
        }
    ]);