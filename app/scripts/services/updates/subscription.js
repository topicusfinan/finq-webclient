'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:subscription
 * @description
 * # Run subscription service
 *
 * Subscribe to the progress of scenarios that are executed in the background.
 *
 */
angular.module('finqApp.service')
    .service('$subscription', function ($socket, EVENTS) {
        var handlers = {},
            handlerRef = 0;

        this.subscribe = function (runId) {
            $socket.emit(EVENTS.SOCKET.RUN.SUBSCRIBE, {run: runId}, true);
        };

        this.unSubscribe = function (runId) {
            $socket.emit(EVENTS.SOCKET.RUN.UNSUBSCRIBE, {run: runId}, true);
        };

        this.register = function (event, handler) {
            if (!handlers[event]) {
                handlers[event] = {};
                registerSocketEvent(event);
            }
            handlers[event][handlerRef] = handler;
            return handlerRef++;
        };

        this.unRegister = function (event, reference) {
            if (handlers[event] && handlers[event][reference]) {
                delete handlers[event][reference];
                if (Object.keys(handlers[event]).length === 0) {
                    delete handlers[event];
                    $socket.off(event);
                }
                return true;
            }
            return false;
        };

        var registerSocketEvent = function (event) {
            $socket.on(event, function (event, data) {
                angular.forEach(handlers[event], function (handler) {
                    handler(event, data);
                });
            });
        };

    });
