angular.module('trainapp.user')
    .factory('IsWebsiteLoginResource', [
        'BaseResource',
        function(BaseResource) {
            "use strict";

            /**
             * inherit from BaseResource
             */
            BaseResource.inherit(IsWebsiteLoginResource, BaseResource);

            /**
             *
             * @constructor
             */
            function IsWebsiteLoginResource() {
                var resourceName = 'islogin';
                IsWebsiteLoginResource.parent.call(this, resourceName);
            }

            IsWebsiteLoginResource.prototype.getLoginStatus = function () {
                return this.resource.get();
            };


            return new IsWebsiteLoginResource();
        }
    ]);