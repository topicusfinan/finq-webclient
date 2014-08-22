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
    .service('authenticate', ['backend', function (backend) {
        var currentUser = null;

        this.load = function(onSuccess,onError) {
            if (currentUser === null) {
                backend.get('/auth/user').success(function(data) {
                    if (data.success) {
                        currentUser = data.user;
                        if (typeof onSuccess === 'function') {
                            onSuccess(currentUser);
                        }
                    } else if (typeof onError === 'function') {
                        onError(data.errors);
                    }
                });
            }
        };

        this.authenticate = function(email,password,onSuccess,onError) {
            backend.post('/auth/user',{
                'email': email,
                'password': password
            }).success(function(data) {
                if (data.success) {
                    currentUser = data.user;
                    if (typeof onSuccess === 'function') {
                        onSuccess(currentUser);
                    }
                } else {
                    if (typeof onError === 'function') {
                        onError(data.error);
                    }
                }
            });
        };
        
    }]);
