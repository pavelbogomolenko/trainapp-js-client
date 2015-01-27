/**
 * @example
 *
 * <device-widget deviceItems="model.devices" editable="1"></device-widget>
 */
angular.module('trainapp')
    .directive('deviceWidget', function () {
        "use strict";

        return {
            restrict: 'E',
            require: 'ngModel',
            controller: 'deviceWidget',
            templateUrl: '/src/modules/training/directives/device-widget.html',
            scope: {
                editable: '=',
                deviceItems: '@'
            },
            link: function ($scope, $element, $attrs, ngModel) {

                /**
                 * device items model
                 * @type {Object[]}
                 */
                $scope.deviceItems = $scope.deviceItems || [];
            }
        };

    }).controller('deviceWidget', [
        '$scope',
        function ($scope) {
            "use strict";

            /**
             * Adds new empty device item
             */
            $scope.add = function () {
                $scope.deviceItems.push({});
            };

            /**
             * Removes device item
             *
             * @param {Object} item
             */
            $scope.delete = function (item) {
                $scope.deviceItems = _.reject($scope.deviceItems, item);
            };
        }
    ]);