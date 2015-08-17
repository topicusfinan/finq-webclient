'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:socket
 * @description
 * # Socket communication service
 *
 * Communicate with the backend through a websocket abstraction and handle connection and
 * disconnection events. This abstraction puts the websocket in the digest cycle of angular.
 */
angular.module('finqApp.service')
    .service('$socket', function ($rootScope, FEEDBACK, EVENTS, $config, $websocket, $feedback) {
        var that = this,
            connected = false,
            connecting = false,
            reconnect = false,
            queuedEmits = [],
            persistentEmits = [];

        this.isConnected = function () {
            return connecting || connected || reconnect;
        };

        this.connect = function () {
            $websocket.connect($config.client().socket.endpoint, {
                reconnectAttempts: $config.client().socket.reconnectAttempts,
                reconnectDelay: $config.client().socket.reconnectDelay,
                reconnectDelayMax: $config.client().socket.reconnectDelayMax,
                timeout: $config.client().socket.timeout,
                mocked: $config.client().socket.mocked,
                mockConnectionDelay: $config.client().socket.mockConnectionDelay
            });
            connecting = true;
            $websocket.on(EVENTS.SOCKET.MAIN.CONNECTED, function () {
                connected = true;
                connecting = false;
                angular.forEach(queuedEmits, function (emitRequest) {
                    that.emit(emitRequest.event, emitRequest.data);
                });
                queuedEmits = [];
            });
            $websocket.on(EVENTS.SOCKET.MAIN.DISCONNECTED, function () {
                connected = false;
            });
            $websocket.on(EVENTS.SOCKET.MAIN.ERROR, function (error) {
                console.error('Server socket connection has caused an error', error);
                if (connecting) {
                    $feedback.error(FEEDBACK.ERROR.SOCKET.UNABLE_TO_CONNECT);
                }
            });
            $websocket.on(EVENTS.SOCKET.MAIN.RECONNECTING, function (event, count) {
                reconnect = true;
                if (count === 1) {
                    console.debug('Connection to the server lost, attempting to reconnect');
                    $feedback.notice(FEEDBACK.NOTICE.SOCKET.RECONNECTING);
                }
                console.debug('Reconnection attempt ' + count);
                if (count === $config.client().socket.reconnectAlertCnt) {
                    $feedback.alert(FEEDBACK.ALERT.SOCKET.RECONNECTION_TROUBLE);
                }
            });
            $websocket.on(EVENTS.SOCKET.MAIN.RECONNECTED, function () {
                connected = true;
                reconnect = false;
                $feedback.notice(FEEDBACK.NOTICE.SOCKET.RECONNECTED);
                angular.forEach(persistentEmits, function (emitRequest) {
                    that.emit(emitRequest.event, emitRequest.data);
                });
            });
            $websocket.on(EVENTS.SOCKET.MAIN.RECONNECT_FAILED, function () {
                reconnect = false;
                $feedback.error(FEEDBACK.ERROR.SOCKET.UNABLE_TO_RECONNECT);
            });
        };

        this.on = function (eventName, callback) {
            $websocket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply($websocket, args);
                });
            });
        };

        this.once = function (eventName, callback) {
            $websocket.once(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply($websocket, args);
                });
            });
        };

        this.off = function (eventName) {
            $websocket.off(eventName);
        };

        this.emit = function (eventName, data, resubmitOnReconnect) {
            if (!that.isConnected()) {
                queuedEmits.push({
                    event: eventName,
                    data: data
                });
            } else {
                if (resubmitOnReconnect) {
                    persistentEmits.push({
                        event: eventName,
                        data: data
                    });
                }
                $websocket.emit(eventName, data);
            }
        };

    });
