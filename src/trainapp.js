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
        'trainapp.program'
    ])

/**
 * application constants
 */
    .constant('appConfig', {
        'fbAppId': '362143467323580',
        'fbApiVersion': 'v2.0',
        'defaultRoute': 'program',
        'apiPrefix': 'http://127.0.0.1:8080/api/1.0/'
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
                'HelperService',
                function ($q, $injector, $timeout, HelperService) {
                    return {
                        responseError: function (response) {
                            console.log('responseError', response);
                            if (response.status === 401) {
                                $timeout(function () {
                                    $injector.get('AuthService').logout();
                                }, 0);
                            }
                            return $q.reject(response);
                        },
                        request: function ($config) {
                            //apply header auth only for REST API calls
                            if ((/\/api\//i).test($config.url)) {
                                $config.withCredentials = true;
                                $config.headers['X-AUTH'] = $injector.get('AuthService').getXToken();
                            }
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
                console.log(error);
            });
            $rootScope.$on('$stateNotFound', function () {
                console.log('$stateNotFound');
                $rootScope.httpStatusCode = 404;
            });
        }
    ])

/**
 * Handle authentification. Website + FB
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
                window.console && window.console.log(next.name);

                $rootScope.globalLoading = true;
                $rootScope.loggedIn = false;

                var loginType = StorageService.get('loginType', 'fb');
                AuthService.setType(loginType);

                AuthService.isLoggedIn().then(function (response) {
                    console.log("success", response);

                    if(AuthService.getType() === 'fb') {
                        var fbSession = StorageService.get('fbSession', null);
                        if(fbSession) {
                            AuthService.loginFbUser(fbSession.email).then(function () {
                                if (AuthService.getXToken()) {
                                    $rootScope.loggedIn = true;
                                    $rootScope.globalLoading = false;
                                }
                            }, function (error) {
                                window.console && window.console.log("error occured during loginFbUser", error);
                                AuthService.logout();
                                $rootScope.globalLoading = false;
                            });
                        } else {
                            //try to get fb user profile data and reload state
                            AuthService.logout();
                            $rootScope.globalLoading = false;
                        }
                    } else {
                        if (AuthService.getXToken()) {
                            $rootScope.loggedIn = true;
                        }
                        $rootScope.globalLoading = false;
                    }
                }, function (error) {
                    window.console && window.console.log("not logged in error or smth went wrong", error);
                    //AuthService.logout();
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