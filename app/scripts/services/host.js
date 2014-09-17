'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:host
 * @description
 * # Application host
 *
 * The host service handles all communication with the host of the tests. The test host defines which
 * tests can be ran and will execute the actual tests.
 *
 * The service works as a proxy and will return the appropriate promises for any request type. URLs passed should be
 * relative to the host address.
 */
angular.module('finqApp.service')
    .provider('host', [function () {
        var host = null;

        var validateRequest = function() {
            if (host === null) {
                throw new Error('Communication with the story host was requested but no host was selected');
            }
        };

        return {
            $get: function ($http,$rootScope,EVENTS) {
                return {
                    setHost : function(targetHost) {
                        if (targetHost !== null && (targetHost.address === null || targetHost.address === undefined)) {
                            throw new Error('Invalid target host supplied. No host address was defined');
                        }
                        if ((host === null && targetHost !== null) || (host !== null && targetHost === null) || (host !== null && targetHost !== null && host.key !== targetHost.key)) {
                            host = targetHost;
                            $rootScope.$broadcast(EVENTS.HOST_UPDATED,host);
                        }
                    },

                    getHost: function() {
                        return host;
                    },

                    get : function(url,data) {
                        validateRequest();
                        return $http.get(host.address+url,data);
                    },

                    post : function(url,data) {
                        validateRequest();
                        return $http.post(host.address+url,data);
                    },

                    put : function(url,data) {
                        validateRequest();
                        return $http.put(host.address+url,data);
                    },

                    delete : function(url,data) {
                        validateRequest();
                        return $http.delete(host.address+url,data);
                    },

                    patch : function(url,data) {
                        validateRequest();
                        return $http.patch(host.address+url,data);
                    }
                };
            }
        };
    }]);
