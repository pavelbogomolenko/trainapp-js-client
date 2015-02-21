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
                            '$q',
                            '$timeout',
                            '$stateParams',
                            'ProgramResource',
                            function ($q, $timeout, $stateParams, ProgramResource) {
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
        '$rootScope',
        '$scope',
        'ProgramResource',
        function ($rootScope, $scope, ProgramResource) {
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

            $rootScope.removeDevice = function(device) {
                var deviceId = device._id ? device._id : device.$$hashKey;
                var deviceIndex = _.findIndex($scope.model.program.devices, function (d) {
                    return  d._id === deviceId || d.$$hashKey === deviceId;
                });
                $scope.model.program.devices.splice(deviceIndex, 1);
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
        'HelperService',
        function ($scope, ProgramResource, HelperService) {
            "use strict";

            /**
             * Namespace for login data
             * @type {Object}
             */
            $scope.model = {};

            $scope.programs = ProgramResource.list();
            HelperService.serializeResourcePromise($scope.programs, 'programs');
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
