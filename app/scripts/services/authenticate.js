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
    .service('authenticate', ['backend','$q','$timeout', function (backend,$q,$timeout) {
        var currentUser = null;
        var token = null;

        this.load = function() {
            var deferred = $q.defer();
            var authNotice = $timeout(function () {
                deferred.notify('Authenticating is taking too long');
            },5000);
            backend.get('/auth/user',{
                token: token
            }).success(function(userData) {
                currentUser = userData;
                deferred.resolve(userData);
            }).error(function() {
                deferred.reject('Token authentication failed');
            }).finally(function() {
                authNotice.cancel();
            });
            return deferred.promise;
        };

        this.authenticate = function(email,password) {
            var deferred = $q.defer();
            var authNotice = $timeout(function () {
                deferred.notify('Authenticating is taking too long');
            },5000);
            backend.post('/auth/login',{
                'email': email,
                'password': password
            }).success(function(userData) {
                currentUser = userData;
                deferred.resolve(userData);
            }).error(function(errorCode) {
                deferred.reject(errorCode);
            }).finally(function() {
                authNotice.cancel();
            });
            return deferred.promise;
        };

    }]);
