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
angular.module('finqApp.service')
    .service('authenticate', ['$http','$q','config', function ($http,$q,configProvider) {
        var currentUser = null;
        var token = null;
        var address = '';

        this.setAddress = function(authServerAddress) {
            address = authServerAddress;
        };

        this.load = function() {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Authenticating is taking too long');
            },5000);
            $http.get(address+'/auth/user',{
                token: token
            }).success(function(userData) {
                currentUser = userData;
                deferred.resolve(userData);
            }).error(function(errorCode) {
                deferred.reject(errorCode);
            }).finally(function() {
                clearTimeout(notice);
            });
            return deferred.promise;
        };

        this.authenticate = function(email,password) {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Authenticating is taking too long');
            },5000);
            $http.post(address+'/auth/login',{
                'email': email,
                'password': password
            }).success(function(userData) {
                currentUser = userData;
                deferred.resolve(userData);
            }).error(function(errorCode) {
                deferred.reject(errorCode);
            }).finally(function() {
                clearTimeout(notice);
            });
            return deferred.promise;
        };

        this.getCurrentUser = function() {
            return currentUser;
        };

    }]);
