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
    .service('$authenticate', function ($http, $q, md5) {
        var that = this,
            currentUser = null,
            address = '';

        this.setAddress = function (authServerAddress) {
            address = authServerAddress;
        };

        this.load = function () {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Authenticating is taking too long');
            }, 5000);
            $http.get(address + '/users/current').success(function (userData) {
                currentUser = userData;
                currentUser.gravatarHash = md5.createHash(currentUser.email.trim().toLowerCase());
                deferred.resolve(userData);
            }).error(function (errorCode) {
                deferred.reject(errorCode);
            }).finally(function () {
                clearTimeout(notice);
            });
            return deferred.promise;
        };

        this.authenticate = function (email, password) {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Authenticating is taking too long');
            }, 5000);
            $http.post(address + '/users/login', {
                'email': email,
                'password': password
            }).success(function (authToken) {
                $http.defaults.headers.common['X-api-key'] = authToken;
                that.load().then(function (userData) {
                    deferred.resolve(userData);
                });
            }).error(function (errorCode) {
                deferred.reject(errorCode);
            }).finally(function () {
                clearTimeout(notice);
            });
            return deferred.promise;
        };

        this.getCurrentUser = function () {
            return currentUser;
        };

    });
