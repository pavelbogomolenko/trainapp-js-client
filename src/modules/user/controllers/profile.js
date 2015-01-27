angular.module('trainapp.user')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";
            $stateProvider.state('userprofile', {
                url: '/userprofile',
                controller: 'UserProfileCtrl',
                templateUrl: '/src/modules/user/partials/profile-form.html'
            });
        }
    ])

    .controller('UserProfileCtrl', [
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