angular.module('trainapp.user')
    .factory('WebsiteLogoutResource', [
        'BaseResource',
        function(BaseResource) {
            "use strict";

            /**
             * inherit from BaseResource
             */
            BaseResource.inherit(WebsiteLogoutResource, BaseResource);

            /**
             *
             * @constructor
             */
            function WebsiteLogoutResource() {
                var resourceName = 'logout';
                WebsiteLogoutResource.parent.call(this, resourceName);
            }

            WebsiteLogoutResource.prototype.logout = function () {
                return this.resource.save(this.getResourceEntity());
            };

            return new WebsiteLogoutResource();
        }
    ]);