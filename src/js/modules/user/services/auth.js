angular.module('trainapp.user')
    .factory('AuthService', [
        '$facebook',
        '$rootScope',
        'StorageService',
        function($facebook, $rootScope, StorageService) {
            "use strict";

            $rootScope.$on('fb.auth.logout', function(e, rsp) {
                StorageService.remove('loggedIn');
            });

            $rootScope.$on('fb.auth.login', function(e, rsp) {
                StorageService.set('loggedIn', true);
            });

            function AuthService() {
                this.AuthEvents = {
                    loginSuccess: 'loginSuccess',
                    loginFailed: 'loginFailed',
                    logoutSuccess: 'logoutSuccess',
                    sessionTimeout: 'sessionTimeout',
                    notAuthenticated: 'notAuthenticated',
                    notAuthorized: 'notAuthorized'
                };
            }

            AuthService.prototype.isLoggedIn = function() {
                return $facebook.getLoginStatus();
            };

            AuthService.prototype.logout = function() {
                return $facebook.logout();
            };

            return new AuthService();
        }
    ]);