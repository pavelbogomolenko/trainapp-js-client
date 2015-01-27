angular.module('trainapp.training')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";

            $stateProvider
                .state('program', {
                    url: '/program',
                    controller: 'ProgramListCtrl',
                    templateUrl: '/src/modules/training/partials/program-list.html'
                })
                .state('program-new', {
                    url: '/program-new',
                    controller: 'ProgramCtrl',
                    templateUrl: '/src/modules/training/partials/program-create.html'
                })
                .state('program-edit', {
                    url: '/program-edit/:programId',
                    controller: 'ProgramCtrl',
                    templateUrl: '/src/modules/training/partials/program-create.html'
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
    ])
    .controller('ProgramListCtrl', [
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
