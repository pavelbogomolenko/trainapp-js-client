angular.module('trainapp.user')
    .factory('AuthService', [
        '$facebook',
        function($facebook) {
            "use strict";

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

            return new AuthService();
        }
    ]);