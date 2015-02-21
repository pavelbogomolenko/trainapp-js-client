angular.module('trainapp.user')

    .controller('UserLogoutCtrl', [
        'appConfig',
        '$state',
        '$rootScope',
        '$scope',
        'AuthService',
        function (appConfig, $state, $rootScope, $scope, AuthService) {
            "use strict";

            $scope.logout = function () {
                if(AuthService.getXToken()) {
                    AuthService.logout();
                }
            };
        }
    ]);