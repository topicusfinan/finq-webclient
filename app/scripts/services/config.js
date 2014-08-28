/**
 * Created by c.kramer on 8/15/2014.
 */
'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:config
 * @description
 * # Application configuration provider
 *
 * Provides application wide configuration values. These values are retrieves from
 * the server upon the loading of the application.
 */
angular.module('finqApp.services')
    .provider('config', [function () {
        var configData = null;
        var loadConfigData = function($http,$q,$timeout,backend) {
            var deferred = $q.defer();
            var configNotice = $timeout(function () {
                deferred.notify('Loading configuration is taking too long');
            },5000);
            $http.get('/scripts/config.json').success(function (data) {
                backend.setServerAddress(data.SERVER_ADDRESS);
                backend.get('/app/info').success(function (data) {
                    configData = data;
                    deferred.resolve(data);
                }).error(function(data,status) {
                    deferred.reject('Failed to load server configuration');
                    throw 'Error loading server configuration. Server responded with status '+status;
                });
            }).error(function(data,status) {
                deferred.reject('Failed to load app configuration');
                throw 'Error loading app configuration. Server responded with status '+status;
            }).finally(function() {
                configNotice.cancel();
            });
            return deferred.promise;
        };
        return {
            $get: function ($http,$q,$timeout,backend) {
                return {
                    load: function() {
                        return loadConfigData($http,$q,$timeout,backend);
                    },
                    title: function() {
                        return configData.subject;
                    },
                    appTitle: function() {
                        return configData.appTitle;
                    }
                };
            }
         };
    }]);
