'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:websocket
 * @description
 * # Websocket service
 *
 * Handle communication with a backend through a websocket. This also supports automatic
 * reconnects.
 *
 */
angular.module('finqApp.service')
    .service('websocket', ['EVENTS', function (EVENTS) {
        var that = this,
            listeners = {},
            socket,
            options = {
                reconnectAttempts: 0,
                reconnectDelay: 0,
                reconnectDelayMax: 0,
                timeout: 0,
                mocked: false,
                mockConnectionDelay: 0
            },
            disconnectedOn,
            lastEndpoint = '',
            reconnecting = null,
            forceDisconnect = false;

        this.connect = function(endPoint, passedOptions) {
            if (passedOptions) {
                setupOptions(passedOptions);
            }
            if (options.mocked) {
                mockConnection();
            } else {
                socket = new WebSocket(endPoint);
            }
            lastEndpoint = endPoint;
            socket.onopen = function() {
                handleConnect();
            };
            socket.onclose = function() {
                handleDisconnect(new Date());
            };
            socket.onmessage = function(data) {
                handleMessage(data);
            };
            socket.onerror = function(error) {
                dispatchEvent(EVENTS.SOCKET.MAIN.ERROR, error);
            };
            return socket;
        };

        this.disconnect = function() {
            if (socket) {
                forceDisconnect = true;
                socket.close();
            }
        };

        this.on = function (eventName, callback) {
            (listeners[eventName] = listeners[eventName] || []).push(callback);
        };

        this.once = function (eventName, callback) {
            (listeners[eventName] = listeners[eventName] || []).push(callback);
            callback._once = true;
        };

        this.off = function(eventName, callback) {
            if (callback) {
                var index = listeners[eventName].indexOf(callback);
                if (index > -1) {
                    listeners[eventName].splice(index, 1);
                }
            } else {
                delete listeners[eventName];
            }
        };

        this.emit = function (eventName, data) {
            if (socket) {
                if (options.mocked) {
                    dispatchEvent(eventName, data);
                } else {
                    socket.send(angular.toJson({
                        event: eventName,
                        data: data
                    }));
                }
            }
        };

        var mockConnection = function() {
            socket = {
                close: function() {}
            };
            setTimeout(function() {
                socket.onopen();
            }, options.mockConnectionDelay);
        };

        var setupOptions = function(passedOptions) {
            angular.extend(options,passedOptions);
        };

        var dispatchEvent = function(eventName, data) {
            if (listeners[eventName]) {
                for (var i=0; i<listeners[eventName].length; i++) {
                    listeners[eventName][i](eventName, data);
                    if (listeners[eventName][i]._once) {
                        listeners[eventName].splice(i--, 1);
                    }
                }
            }
        };

        var handleConnect = function() {
            if (reconnecting) {
                dispatchEvent(EVENTS.SOCKET.MAIN.RECONNECTED);
                clearTimeout(reconnecting);
            } else {
                dispatchEvent(EVENTS.SOCKET.MAIN.CONNECTED);
            }
        };

        var handleDisconnect = function() {
            dispatchEvent(EVENTS.SOCKET.MAIN.DISCONNECTED);
            if (forceDisconnect || !options.reconnectAttempts) {
                forceDisconnect = false;
                return false;
            }
            disconnectedOn = new Date();
            return attemptReconnect(1);
        };

        var handleMessage = function(messageData) {
            var message = angular.fromJson(messageData);
            if (message.event) {
                dispatchEvent(message.event, message.data);
            }
        };

        var attemptReconnect = function(attempts) {
            var now = new Date();
            if (now-disconnectedOn > options.timeout || attempts > options.reconnectAttempts) {
                dispatchEvent(EVENTS.SOCKET.MAIN.RECONNECT_FAILED);
                return false;
            }
            var delay = Math.min(options.reconnectDelayMax,(attempts * options.reconnectDelay));
            reconnecting = setTimeout(function() {
                if (socket.readyState === socket.CLOSED) {
                    dispatchEvent(EVENTS.SOCKET.MAIN.RECONNECTING);
                    that.connect(lastEndpoint);
                    attemptReconnect(++attempts);
                }
            }, delay);
            return true;
        };

    }]);
