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
angular.module('finqApp.service')
    .provider('config', [function () {
        var configData = {};
        var loadConfigData = function($http,$q,$timeout,backend) {
            var deferred = $q.defer();
            var configNotice = $timeout(function () {
                deferred.notify('Loading configuration is taking too long');
            },5000);
            $http.get('/scripts/config.json').success(function (clientConfig) {
                configData.client = clientConfig;
                backend.setServerAddress(clientConfig.address);
                backend.get('/app/info').success(function (serverConfig) {
                    configData.server = serverConfig;
                    deferred.resolve(serverConfig);
                }).error(function(serverConfig,status) {
                    deferred.reject('Failed to load server configuration');
                    throw 'Error loading server configuration. Server responded with status '+status;
                });
            }).error(function(clientConfig,status) {
                deferred.reject('Failed to load client configuration');
                throw 'Error loading client configuration. Server responded with status '+status;
            }).finally(function() {
                $timeout.cancel(configNotice);
            });
            return deferred.promise;
        };
        return {
            $get: function ($http,$q,$timeout,backend) {
                return {
                    load: function() {
                        return loadConfigData($http,$q,$timeout,backend);
                    },
                    client: function() {
                        return configData.client;
                    },
                    server: function() {
                        return configData.server;
                    }
                };
            }
         };
    }]);
