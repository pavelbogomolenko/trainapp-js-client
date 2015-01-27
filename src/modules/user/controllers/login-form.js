angular.module('trainapp.user')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";
            $stateProvider.state('login', {
                url: '/login',
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
        function (appConfig, $state, $rootScope, $scope) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};

            /**
             * listen to fb.auth.login event
             */
            $rootScope.$on('fb.auth.login', function(e, rsp) {
                $state.go(appConfig.defaultRoute);
            });
        }
    ]);