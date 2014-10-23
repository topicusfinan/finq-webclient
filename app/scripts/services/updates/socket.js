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
    .service('socket', [
        '$rootScope',
        'config',
        'feedback',
        'FEEDBACK',
        'EVENTS',
        function ($rootScope, configProvider, feedbackService, FEEDBACK, EVENTS) {
        var socket,
            connected = false,
            connecting = false,
            reconnect = false,
            connectionListeners = [];

        this.isConnected = function() {
            return connecting || connected || reconnect;
        };

        this.connect = function() {
            socket = io.connect(configProvider.client().socket.endpoint,{
                reconnectionAttempts: configProvider.client().socket.reconnectionAttempts,
                reconnectionDelay: configProvider.client().socket.reconnectionDelay,
                reconnectionDelayMax: configProvider.client().socket.reconnectionDelayMax,
                timeout: configProvider.client().socket.timeout
            });
            connecting = true;
            socket.on(EVENTS.SOCKET.MAIN.CONNECTED, function() {
                connected = true;
                connecting = false;
                angular.forEach(connectionListeners, function(listener) {
                    listener();
                });
            });
            socket.on(EVENTS.SOCKET.MAIN.DISCONNECTED, function() {
                connected = false;
            });
            socket.on(EVENTS.SOCKET.MAIN.ERROR, function(error) {
                console.error('Server socket connection has caused an error',error);
                if (connecting) {
                    feedbackService.error(FEEDBACK.ERROR.SOCKET.UNABLE_TO_CONNECT);
                }
            });
            socket.on(EVENTS.SOCKET.MAIN.RECONNECTING, function(count) {
                reconnect = true;
                if (count === 1) {
                    console.debug('Connection to the server lost, attempting to reconnect');
                    feedbackService.notice(FEEDBACK.NOTICE.SOCKET.RECONNECTING);
                }
                console.debug('Reconnection attempt '+count);
                if (count === configProvider.client().socket.reconnectAlertCnt) {
                    feedbackService.alert(FEEDBACK.ALERT.SOCKET.RECONNECTION_TROUBLE);
                }
            });
            socket.on(EVENTS.SOCKET.MAIN.RECONNECTED, function() {
                connected = true;
                reconnect = false;
                feedbackService.notice(FEEDBACK.NOTICE.SOCKET.RECONNECTED);
            });
            socket.on(EVENTS.SOCKET.MAIN.RECONNECT_FAILED, function() {
                reconnect = false;
                feedbackService.error(FEEDBACK.ERROR.SOCKET.UNABLE_TO_RECONNECT);
            });
        };

        this.on = function (eventName, callback) {
            if (socket === undefined) {
                throw new Error('Cannot subscribe without first making a connection');
            }
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        this.once = function (eventName, callback) {
            if (socket === undefined) {
                throw new Error('Cannot subscribe without first making a connection');
            }
            socket.once(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        this.off = function(eventName) {
            socket.removeAllListeners(eventName);
        };

        this.emit = function (eventName, data, callback) {
            if (socket === undefined) {
                throw new Error('Cannot broadcast without first making a connection');
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

        this.addConnectionListener = function(listener) {
            connectionListeners.push(listener);
        };

  }]);
