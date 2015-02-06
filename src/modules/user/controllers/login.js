angular.module('trainapp.user')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";
            $stateProvider
                .state('logout', {
                    url: '/logout',
                    controller: 'UserLoginCtrl',
                    templateUrl: '/src/modules/user/partials/login-form.html'
                });
        }
    ])

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

            if($state.is('logout')) {
                AuthService.logout();
            }

            /**
             * listen to fb.auth.login event
             */
            $rootScope.$on('fb.auth.login', function(e, rsp) {
                $state.go(appConfig.defaultRoute);
            });

            $scope.fbLogin = function() {
                AuthService.setType('fb');
                window.console && window.console.log(AuthService.login());
            };

            $scope.login = function() {
                AuthService.setType('website');
                AuthService.login($scope.model.email, $scope.model.password);
            };
        }
    ]);