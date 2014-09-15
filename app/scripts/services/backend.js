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
    .provider('backend', [function () {
        var serverAddress = '';

        return {
            $get: function ($http) {
                return {
                    setServerAddress : function(address) {
                        serverAddress = address;
                    },

                    get : function(url,data) {
                        return $http.get(serverAddress+url,data);
                    },

                    post : function(url,data) {
                        return $http.post(serverAddress+url,data);
                    },

                    put : function(url,data) {
                        return $http.put(serverAddress+url,data);
                    },

                    delete : function(url,data) {
                        return $http.delete(serverAddress+url,data);
                    },

                    patch : function(url,data) {
                        return $http.patch(serverAddress+url,data);
                    }
                };
            }
        };
    }]);
