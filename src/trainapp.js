/**
 * define module dependencies
 */
angular.module('trainapp', [
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ui.router',
        'xeditable',
        'ngFacebook',
        'trainapp.user',
        'trainapp.training'
    ])

/**
 * application constants
 */
    .constant('appConfig', {
        'fbAppId': '362143467323580',
        'fbApiVersion': 'v2.0',
        'defaultRoute': 'program'
    })

/**
 * Services configuration
 */
    .config([
        'appConfig',
        '$locationProvider',
        '$stateProvider',
        '$facebookProvider',
        function (appConfig, $locationProvider, $stateProvider, $facebookProvider) {
            "use strict";

            /**
             * configure urls
             */
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            //FB API configuration
            $facebookProvider.setAppId(appConfig.fbAppId);
            $facebookProvider.setVersion(appConfig.fbApiVersion);
            $facebookProvider.setCustomInit({
                status     : true,
                xfbml      : true
            });
        }
    ])

/**
 *  Other services configuration which are not available via config
 */
    .run([
        'editableOptions',
        function (editableOptions) {
            "use strict";

            /**
             * configure xeditable
             * @type {string}
             */
            editableOptions.theme = 'bs3';

            /**
             * inject FB code
             */
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    ])

/**
 *  Http Status code handling
 */
    .run([
        '$rootScope',
        function ($rootScope) {
            "use strict";

            /**
             * Listen to state changes
             */
            $rootScope.$on('$stateChangeStart', function () {
                console.log('$stateChangeStart');
                $rootScope.httpStatusCode = 102;
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                console.log('$stateChangeSuccess', $rootScope.globalLoading);
                //$rootScope.httpStatusCode = !$rootScope.globalLoading ? 200 : 102;
                $rootScope.httpStatusCode = 200;
            });
            $rootScope.$on('$stateChangeError', function (event, toScope, toScopeParams, fromScope, fromScopeParams, error) {
                console.log('$stateChangeError');
                $rootScope.httpStatusCode = typeof error.status === 'undefined' || error.status === 0 ? 500 : error.status;
            });
            $rootScope.$on('$stateNotFound', function () {
                console.log('$stateNotFound');
                $rootScope.httpStatusCode = 404;
            });
        }
    ])

/**
 * Handle authentification
 */
    .run([
        'appConfig',
        '$state',
        '$rootScope',
        'AuthService',
        'StorageService',
        function (appConfig, $state, $rootScope, AuthService, StorageService) {
            "use strict";

            /**
             * Listen to state changes
             */
            $rootScope.$on('$stateChangeStart', function (event, next) {
                $rootScope.globalLoading = true;
                if(next.name == 'login') {
                    $rootScope.globalLoading = false;
                } else {
                    AuthService.isLoggedIn().then(function (response) {
                        console.log("success", response);
                        $rootScope.globalLoading = false;

                        console.log("globalLoading",  $rootScope.globalLoading);
                        console.log("go to", next.name);
                    }, function (error) {
                        console.log("error", error);
                        $rootScope.globalLoading = false;
                        $state.go('login');
                    });
                }
            });
        }
    ])

    .controller('IndexCtrl', [
        'appConfig',
        '$state',
        '$rootScope',
        function (appConfig, $state, $rootScope) {
            "use strict";

            $rootScope.state = $state;
            $state.go(appConfig.defaultRoute);
        }
    ]);