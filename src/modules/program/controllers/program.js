angular.module('trainapp.program')

    .config([
        '$stateProvider',
        function ($stateProvider) {
            "use strict";

            $stateProvider
                .state('program', {
                    url: '/program',
                    controller: 'ProgramListCtrl',
                    templateUrl: '/src/modules/program/partials/program-list.html'
                })
                .state('program-detail', {
                    url: '/program/{programId:[0-9a-zA-Z]+}',
                    controller: 'ProgramDetailCtrl',
                    templateUrl: '/src/modules/program/partials/program-detail.html',
                    resolve: {
                        program: [
                            '$stateParams',
                            'ProgramResource',
                            function ($stateParams, ProgramResource) {
                                return ProgramResource.getOneById($stateParams.programId);
                            }
                        ]
                    }
                })
                .state('program-new', {
                    url: '/program-new',
                    controller: 'ProgramAddCtrl',
                    templateUrl: '/src/modules/program/partials/program-create.html'
                })
                .state('program-edit', {
                    url: '/program-edit/:programId',
                    controller: 'ProgramEditCtrl',
                    templateUrl: '/src/modules/program/partials/program-create.html'
                });
        }
    ])

    .controller('ProgramAddCtrl', [
        '$scope',
        'ProgramResource',
        function ($scope, ProgramResource) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};
            $scope.model.program = {};
            $scope.model.program.devices = [];

            $scope.addDevice = function() {
                $scope.model.program.devices.push({});
            };

            //init with one empty device
            $scope.addDevice();

            $scope.saveProgram = function() {
                console.log('saving program');
                console.log($scope.model.program);

                ProgramResource.add($scope.model.program);
            };
        }
    ])

    .controller('ProgramEditCtrl', [
        '$rootScope',
        '$scope',
        function ($rootScope, $scope) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};
            $scope.model.devices = $scope.model.devices || [];


            $scope.addDevice = function() {
                $scope.model.devices.push({});
            };

            $rootScope.removeDevice = function(device) {
                //$scope.model.devices.slice(push({}));
                console.log(device);
            };

            $scope.saveProgram = function() {
                console.log('saving program', $scope.model.devices);
            };

            $scope.model.devices = [
                {
                    "_id": "123213", "title": "A1", "created": moment().format(),
                    "programId": "9473", "trainingId": null, lastTrained: null,
                    attributes:[{"title": "weight", "value": 120, "measure": "kg"}]
                },
                {
                    "_id": "3456", "title": "A2", "created": moment().format(),
                    "programId": "9473", "trainingId": null, lastTrained: null,
                    attributes:[{"title": "weight", "value": 122, "measure": "kg"}]
                }
            ];
        }
    ])

    .controller('ProgramListCtrl', [
        '$scope',
        'ProgramResource',
        function ($scope, ProgramResource) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};

            $scope.programs = ProgramResource.list();
        }
    ])

    .controller('ProgramDetailCtrl', [
        '$scope',
        'program',
        function ($scope, program) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};
            $scope.model.program = {};

            $scope.model.program = program;
        }
    ]);
