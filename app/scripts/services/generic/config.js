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
    .provider('$config', function () {
        var configData = {};
        var loadConfigData = function($http,$q,$backend) {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Loading configuration is taking too long');
            },5000);
            $http.get('/scripts/config.json').success(function (clientConfig) {
                configData.client = clientConfig;
                $backend.setServerAddress(clientConfig.address);
                $backend.get('/app').success(function (serverConfig) {
                    configData.server = serverConfig;
                    deferred.resolve(serverConfig);
                }).error(function() {
                    deferred.reject('Failed to load server configuration');
                });
            }).error(function() {
                deferred.reject('Failed to load client configuration');
            }).finally(function() {
                clearTimeout(notice);
            });
            return deferred.promise;
        };
        return {
            $get: function ($http,$q,$backend) {
                return {
                    load: function() {
                        return loadConfigData($http,$q,$backend);
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
    });
