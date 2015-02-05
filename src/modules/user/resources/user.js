angular.module('trainapp.user')
    .factory('UserResource', [
        '$resource',
        'appConfig',
        function($resource, appConfig) {
            "use strict";

            var apiPrefix = appConfig.apiPrefix;
            var resourceName = 'user';

            return $resource(apiPrefix + resourceName + '/' + ':id');
        }
    ]);