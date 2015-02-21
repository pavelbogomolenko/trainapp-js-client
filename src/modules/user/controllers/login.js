angular.module('trainapp.user')

    .controller('UserLoginCtrl', [
        'appConfig',
        '$state',
        '$rootScope',
        '$scope',
        'AuthService',
        function (appConfig, $state, $rootScope, $scope, AuthService) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};

            $scope.fbLogin = function() {
                AuthService.setType('fb');
                AuthService.login();
            };

            $scope.login = function() {
                AuthService.setType('website');
                AuthService.login($scope.model.email, $scope.model.password);
            };
        }
    ]);