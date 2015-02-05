'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:backend
 * @description
 * # Application backend
 *
 * The backend service handles the communication between the client and the backend. All http requests or other
 * types of communication with the backend should be facilitated through operations provided by this service instead
 * of directly using the $http provider.
 *
 * The service works as a proxy and will return the appropriate promises for any request type. URLs passed should be
 * relative to the server address.
 */
angular.module('finqApp.service')
    .provider('backend', function () {
        var serverAddress = '';

        var transformGetParameters = function (url, queryData) {
            var first = true;

            var transformArray = function (key, values) {
                var paramList = '';
                var first = true;
                for (var i = 0; i < values.length; i++) {
                    paramList += (first ? '' : '&') + key + '=' + values[i];
                    first = false;
                }
                return paramList;
            };

            for (var key in queryData) {
                if (queryData.hasOwnProperty(key)) {
                    url += first ? '?' : '&';
                    if (typeof queryData[key] === 'object') {
                        url += transformArray(key, queryData[key]);
                    } else {
                        url += key + '=' + queryData[key];
                    }
                    first = false;
                }
            }
            return url;
        };

        return {
            $get: function ($http) {
                return {
                    setServerAddress: function (address) {
                        serverAddress = address;
                    },

                    get: function (url, queryData) {
                        if (queryData && typeof queryData === 'object') {
                            url = transformGetParameters(url, queryData);
                        }
                        return $http.get(serverAddress + url);
                    },

                    post: function (url, data) {
                        return $http.post(serverAddress + url, data);
                    },

                    put: function (url, data) {
                        return $http.put(serverAddress + url, data);
                    },

                    delete: function (url, data) {
                        return $http.delete(serverAddress + url, data);
                    },

                    patch: function (url, data) {
                        return $http.patch(serverAddress + url, data);
                    }
                };
            }
        };
    });
