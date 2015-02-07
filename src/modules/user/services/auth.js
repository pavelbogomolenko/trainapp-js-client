angular.module('trainapp.user')
    .factory('AuthService', [
        '$q',
        '$state',
        '$facebook',
        '$rootScope',
        'StorageService',
        'FbloginResource',
        'IsWebsiteLoginResource',
        'WebsiteLoginResource',
        function($q, $state, $facebook, $rootScope, StorageService, FbloginResource, IsWebsiteLoginResource, WebsiteLoginResource) {
            "use strict";

            /**
             *
             * @constructor
             */
            function AuthService() {
                /**
                 * type of auth service to use
                 * @type {string}
                 */
                this.type = 'fb';

                var self = this;

                $rootScope.$on('fb.auth.logout', function(e, rsp) {
                    window.console && window.console.log('fb.auth.logout');
                    self.clearSession();
                });

                $rootScope.$on('fb.auth.login', function(e, rsp) {
                    window.console && window.console.log('fb.auth.login');
                    self.getFbProfileForLogin();
                });

                $rootScope.$on('loginSuccess', function(e, rsp) {
                    window.console && window.console.log('website loginSuccess');
                    $state.reload();
                });
            }

            AuthService.prototype = {
                setType: function(type) {
                    this.type = type;
                    StorageService.set('loginType', this.type);
                },
                getType: function() {
                    return this.type;
                },
                /**
                 * Checks where user isLoggedIn
                 *
                 * @returns Promise{*}
                 */
                isLoggedIn: function() {
                    var deferred = $q.defer();

                    switch(this.getType()) {
                        case 'fb':
                            $facebook.getLoginStatus().then(function (response) {
                                if(response.status === 'connected') {
                                    deferred.resolve(response);
                                } else {
                                    deferred.reject(response);
                                }
                            }, function (error) {
                                console.log("error FB getLoginStatus", error);
                                deferred.reject(error);
                            });
                            break;
                        case 'website':
                            if(this.getXToken()) {
                                IsWebsiteLoginResource.getLoginStatus().$promise.then(function (response) {
                                    deferred.resolve(response);
                                }, function (error) {
                                    console.log("error website getLoginStatus", error);
                                    deferred.reject(error);
                                });
                            } else {
                                deferred.reject('no valid X-Auth token');
                            }
                            break;
                        default:
                            throw this.getType() + " authorization not supported";
                    }
                    return deferred.promise;
                },
                loginFbUser: function(email) {
                    var deferred = $q.defer();

                    FbloginResource.fblogin(email).$promise.then(function (fbSuccessResponse) {
                        StorageService.set('userSession', fbSuccessResponse);
                        deferred.resolve(fbSuccessResponse);
                    }, function (fbErrorResponse) {
                        deferred.reject(fbErrorResponse);
                    });

                    return deferred.promise;
                },
                logout: function() {
                    $facebook.logout();
                    this.clearSession();
                },
                login: function(email, password) {
                    switch(this.getType()) {
                        case 'fb':
                            return $facebook.login();
                            break;
                        case 'website':
                            return WebsiteLoginResource.login(email, password).$promise.then(function (response) {
                                StorageService.set('userSession', response);
                                $rootScope.$broadcast('loginSuccess');
                            }, function (error) {
                                $rootScope.$broadcast('loginFailed');
                            });
                            break;
                        default:
                            throw this.getType() + " authorization not supported";
                    }
                },
                getXToken: function(){
                    var userSession = StorageService.get('userSession', {});
                    return userSession.sessionId;
                },
                clearSession: function() {
                    StorageService.remove('fbSession');
                    StorageService.remove('userSession');
                    StorageService.remove('loginType');
                },
                /**
                 * get user profile data from FB for login
                 * save it in local storage and reload current state to go through auth process
                 */
                getFbProfileForLogin: function() {
                    $facebook.cachedApi('/me').then(function(fbUserResponse) {
                        StorageService.set('fbSession', fbUserResponse);
                        //force current state to reload in order to pass through $stateChangeStart checks
                        $state.reload();
                    }, function(error) {
                        window.console && window.console.log("error getFbProfileForLogin", error);
                    });
                }
            };

            return new AuthService();
        }
    ]);