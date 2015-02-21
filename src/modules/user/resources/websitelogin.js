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
                return this.save({email: email, password: password});
            };

            return new WebsiteLoginResource();
        }
    ]);