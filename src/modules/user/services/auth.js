angular.module('trainapp.user')
    .factory('AuthService', [
        '$q',
        '$state',
        '$facebook',
        '$rootScope',
        'StorageService',
        'FbloginResource',
        function($q,$state, $facebook, $rootScope, StorageService, FbloginResource) {
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
                    var th = this;
                    var deferred = $q.defer();

                    switch(th.getType()) {
                        case 'fb':
                            $facebook.getLoginStatus().then(function (response) {
                                if(response.status === 'connected') {
                                    $rootScope.$broadcast(th.AuthEvents.loginSuccess);
                                    deferred.resolve(response);
                                } else {
                                    $rootScope.$broadcast(th.AuthEvents.notAuthorized);
                                    deferred.reject(response);
                                }
                            }, function (error) {
                                console.log("error getLoginStatus", error);
                                $rootScope.$broadcast(th.AuthEvents.loginFailed);
                                deferred.reject(error);
                            });
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

                login: function() {
                    return $facebook.login();
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