'use strict';
/*global io:false */

/**
 * @ngdoc function
 * @name finqApp.service:socket
 * @description
 * # Socket io service
 *
 * Generate a socket.io websocket and make its base functions available through the scope.
 *
 */
angular.module('finqApp.service')
    .service('socket', ['$rootScope', 'config', function ($rootScope, configProvider) {
        var socket;
        var init = function() {
            socket = io.connect(configProvider.client().socketEndpoint);
        };

        this.on = function (eventName, callback) {
            if (socket === undefined) {
                init();
            }
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        this.emit = function (eventName, data, callback) {
            if (socket === undefined) {
                init();
            }
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        };
  }]);
