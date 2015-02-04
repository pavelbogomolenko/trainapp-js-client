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
        'defaultRoute': 'program',
        'apiPrefix': '/api/1.0/'
    })

/**
 * Services configuration
 */
    .config([
        'appConfig',
        '$httpProvider',
        '$locationProvider',
        '$stateProvider',
        '$facebookProvider',
        function (appConfig, $httpProvider, $locationProvider, $stateProvider, $facebookProvider) {
            "use strict";

            /**
             * http service configuration
             */
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                '$timeout',
                function ($q, $injector, $timeout) {
                    return {
                        responseError: function (response) {
                            if (response.status === 401) {
                                $timeout(function () {
                                    $injector.get('AuthService').logout();
                                }, 0);
                            }
                            return $q.reject(response);
                        },
                        request: function ($config) {
                            $config.headers['cache-control'] = 'max-age=180';
                            $config.headers['X-AUTH'] = $injector.get('AuthService').getXToken();
                            return $config;
                        }
                    };
                }
            ]);

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
                status: true,
                xfbml: true
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
        '$state',
        '$rootScope',
        function ($state, $rootScope) {
            "use strict";

            /**
             * check if given url exists in routes
             */
            if(_.filter($state.get(),  { 'url': window.location.pathname }).length === 0) {
                $rootScope.httpStatusCode = 404;
            }

            /**
             * Listen to state changes
             */
            $rootScope.$on('$stateChangeStart', function () {
                console.log('$stateChangeStart');
                $rootScope.httpStatusCode = 102;
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                console.log('$stateChangeSuccess');
                $rootScope.httpStatusCode = 200;
            });
            $rootScope.$on('$stateChangeError', function (event, toScope, toScopeParams, fromScope, fromScopeParams, error) {
                console.log('$stateChangeError');
                $rootScope.httpStatusCode = typeof error.status === 'undefined' || error.status === 0 ? 500 : error.status;
                console.log($rootScope.httpStatusCode);
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
                $rootScope.loggedIn = false;
                AuthService.isLoggedIn().then(function (response) {
                    console.log("success", response);
                    if(AuthService.getXToken()) {
                        $rootScope.loggedIn = true;
                    }
                    $rootScope.globalLoading = false;

                    console.log("globalLoading",  $rootScope.globalLoading);
                    console.log("go to", next.name);
                }, function (error) {
                    console.log("not logged in error", error);
                    $rootScope.globalLoading = false;
                });
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
            if(window.location.pathname === '/') {
                $state.go(appConfig.defaultRoute);
            }
        }
    ]);