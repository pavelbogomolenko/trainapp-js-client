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
            templateUrl: '/src/modules/training/directives/device-widget.html',
            scope: {
                editable: '=',
                device: '='
            },
            link: function ($scope, $element, $attrs) {

                $scope.device.attributes = $scope.device.attributes || [];
                $scope.addAttribute = function() {
                    $scope.device.attributes.push({});
                };

                $scope.$raddAttribute = function() {
                    $scope.device.attributes.push({});
                };

                $scope.removeDevice = function(device) {
                    $scope.$root.removeDevice(device);
                };
            }
        };

    });