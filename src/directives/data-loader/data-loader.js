/**
 * Directive that helps working with promises
 */
angular.module('trainapp')
    .directive('dataLoader', [
        'HelperService',
        function (HelperService) {
            "use strict";

            return {
                restrict: 'E',
                transclude: true,
                templateUrl: '/src/directives/data-loader/data-loader.html',
                scope: {
                    data: '='
                },
                link: function ($scope, $element, $attrs) {
                    
                    function checkPromise() {
                        var promise = $scope.data.$promise;
                        $scope.status = HelperService.wrapPromise(promise);
                    }

                    /**
                     * Watch for content promise changes
                     */
                    $scope.$watch('data.$promise', checkPromise);
                }
            };
        }
    ]);