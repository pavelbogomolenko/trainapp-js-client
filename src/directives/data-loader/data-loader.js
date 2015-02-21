/**
 * Directive that helps working with promises
 */
angular.module('trainapp')
    .directive('trainappLoader', [
        'HelperService',
        function (HelperService) {
            "use strict";

            return {
                restrict: 'E',
                transclude: true,
                templateUrl: '/src/directives/data-loader/data-loader.html',
                scope: {
                    datasource: '='
                },
                link: function ($scope, $element, $attrs) {


                    function checkPromise() {
                        var promise = $scope.datasource.$promise;
                        $scope.status = HelperService.extendPromise(promise, promise);
                    }

                    /**
                    * Watch for content promise changes
                    */
                    $scope.$watch('datasource.$promise', checkPromise);
                }
            };
        }
    ]);