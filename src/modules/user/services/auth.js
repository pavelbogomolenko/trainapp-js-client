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
                this.AuthEvents = {
                    loginSuccess: 'loginSuccess',
                    loginFailed: 'loginFailed',
                    logoutSuccess: 'logoutSuccess',
                    sessionTimeout: 'sessionTimeout',
                    notAuthenticated: 'notAuthenticated',
                    notAuthorized: 'notAuthorized'
                };

                var self = this;

                $rootScope.$on('fb.auth.logout', function(e, rsp) {
                    console.log('fb.auth.logout');
                    self.clearSession();
                });

                $rootScope.$on('fb.auth.login', function(e, rsp) {
                    console.log('fb.auth.login');
                    $facebook.cachedApi('/me').then(function(fbUserResponse) {
                        StorageService.set('fbSession', fbUserResponse);
                        //force current state to reload in order to pass through $stateChangeStart checks
                        $state.reload();
                    }, function(error) {
                        console.log("error cachedApi", error);
                    });
                });

                $rootScope.$on('loginSuccess', function(e, rsp) {
                    window.console && window.console.log('website loginSuccess');
                    $state.reload();
                });
            }

            AuthService.prototype = {
                setType: function(type) {
                    this.type = type;
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
                            throw new Exception(th.getType() + " authorization not supported");
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
                    return $facebook.logout();
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
                            throw new Exception(this.getType() + " authorization not supported");
                    }
                },
                getXToken: function(){
                    var userSession = StorageService.get('userSession', {});
                    return userSession['sessionId'];
                },
                clearSession: function() {
                    StorageService.remove('fbSession');
                    StorageService.remove('userSession');
                }
            };

            return new AuthService();
        }
    ]);