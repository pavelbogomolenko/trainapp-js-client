angular.module('trainapp.user')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";
            $stateProvider.state('login', {
                url: '/login',
                controller: 'UserLoginCtrl',
                templateUrl: '/src/js/modules/user/partials/login-form.html'
            });
        }
    ])

    .controller('UserLoginCtrl', [
        '$scope',
        function ($scope) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};
        }
    ]);