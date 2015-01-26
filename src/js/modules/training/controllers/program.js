angular.module('trainapp.training')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";
            $stateProvider.state('program', {
                url: '/program',
                controller: 'ProgramCtrl',
                templateUrl: '/src/js/modules/training/partials/program.html'
            });
        }
    ])

    .controller('ProgramCtrl', [
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
