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
                return this.save({email:email});
            };

            return new FbloginResource();
        }
    ]);