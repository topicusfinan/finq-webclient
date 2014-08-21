'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:authenticate
 * @description
 * # Application authentication
 *
 * Authenticate using the backend or retrieve data corresponding to the currently
 * authenticated user.
 */
angular.module('finqApp')
    .service('authenticate', ['$http', function ($http) {
        var currentUser = null;

        this.load = function(callback) {
            if (currentUser === null) {
                $http.get('/auth/user').success(function(data) {
                    if (data.user !== undefined) {
                        currentUser = data.user;
                        if (typeof callback === 'function') {
                            callback(currentUser);
                        }
                    }
                });
            }
        };
        
    }]);
