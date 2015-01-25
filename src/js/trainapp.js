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
        'trainapp.user'
    ])

/**
 * General application config
 */
    .config([
        '$locationProvider',
        '$stateProvider',
        '$facebookProvider',
        function ($locationProvider, $stateProvider, $facebookProvider) {
            "use strict";

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            //FB API config
            $facebookProvider.setAppId('362143467323580');
            $facebookProvider.setVersion("v2.2");
        }
    ])

/**
 *  inject FB code
 */
    .run([
        '$rootScope',
        function ($rootScope) {
            "use strict";

            (function () {
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
            }());
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
                $rootScope.httpStatusCode = 102;
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                console.log('$stateChangeSuccess');
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
        '$state',
        '$rootScope',
        'AuthService',
        function ($state, $rootScope, AuthService) {
            "use strict";

            /**
             * Listen to state changes
             */
            $rootScope.$on('$stateChangeStart', function (event, next) {
                if(next.name !== 'login') {
                    AuthService.isLoggedIn().then(function(rsp) {
                        switch(rsp.status) {
                        case 'not_authorized':
                            console.log('login');
                            $rootScope.$broadcast(AuthService.AuthEvents.notAuthorized);
                            $state.go('login');
                            break;
                        case 'connected':
                            $rootScope.$broadcast(AuthService.AuthEvents.loginSuccess);
                            console.log('u are connected');
                            break;
                        default:
                            $rootScope.$broadcast(AuthService.AuthEvents.notAuthorized);
                            $state.go('login');
                            break;
                        }
                    });
                }
            });
        }
    ])

    .controller('IndexCtrl', [
        '$state',
        function ($state) {
            "use strict";

            $state.go('userprofile');
        }
    ]);