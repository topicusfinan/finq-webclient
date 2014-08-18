/**
 * Created by c.kramer on 8/15/2014.
 */
'use strict';

/**
 * @ngdoc function
 * @name finqApp.service.config
 * @description
 * # Application configuration provider
 *
 * Provides application wide configuration values.
 */
angular.module('finqApp.services')
    .provider('config', [function () {
        var configData = null;
        var loadConfigData = function($http,executeAfterLoad) {
            if (configData === null) {
                $http.get('/app/info').success(function (data) {
                    configData = data;
                    executeAfterLoad(data);
                });
            } else {
                executeAfterLoad(configData);
            }
        };
        return {
            $get: function ($http) {
                return {
                    load: function(callback) {
                        loadConfigData($http,callback);
                    },
                    title: function() {
                        return configData.title;
                    }
                };
            }
         };
    }]);
