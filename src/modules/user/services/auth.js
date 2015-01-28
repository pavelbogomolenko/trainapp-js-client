angular.module('trainapp.user')
    .factory('AuthService', [
        '$q',
        '$facebook',
        '$rootScope',
        'StorageService',
        function($q, $facebook, $rootScope, StorageService) {
            "use strict";

            $rootScope.$on('fb.auth.logout', function(e, rsp) {
                console.log('fb.auth.logout');
                StorageService.remove('fbSession');
            });

            $rootScope.$on('fb.auth.login', function(e, rsp) {
                console.log('fb.auth.login');
                $facebook.cachedApi('/me').then(function(fbUserResponse) {
                    StorageService.set('fbSession', fbUserResponse);
                }, function(error) {
                    console.log("error cachedApi", error);
                });
            });

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
                                if(response.status == 'connected') {
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
                logout: function() {
                    console.log("someone called logout");
                    return $facebook.logout();
                },

                login: function() {
                    return $facebook.login();
                }
            };

            return new AuthService();
        }
    ]);