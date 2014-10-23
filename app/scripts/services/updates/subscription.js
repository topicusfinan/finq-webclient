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
    .service('subscription', [
        'socket',
        'EVENTS',
        function (socketService,EVENTS) {
            var handlers = {},
                runs = [],
                queuedRegistrations = [],
                queuedEmits = [],
                handlerRef = 0;

            socketService.addConnectionListener(function() {
                angular.forEach(queuedRegistrations, function(event) {
                    registerSocketEvent(event);
                });
                queuedRegistrations = [];

                angular.forEach(queuedEmits, function(emitRequest) {
                    socketService.emit(emitRequest.event, emitRequest.data);
                });
                queuedEmits = [];

                socketService.on(EVENTS.SOCKET.MAIN.RECONNECTED, function() {
                    angular.forEach(runs, function(runId) {
                        socketService.emit(EVENTS.SOCKET.RUN.SUBSCRIBE,{run: runId});
                    });
                });
            });

            this.subscribe = function(runId) {
                if (!socketService.isConnected()) {
                    socketService.connect();
                    queuedEmits.push({
                        event: EVENTS.SOCKET.RUN.SUBSCRIBE,
                        data: {run: runId}
                    });
                } else {
                    socketService.emit(EVENTS.SOCKET.RUN.SUBSCRIBE, {run: runId});
                }
                runs.push(runId);
            };

            this.register = function(event, handler) {
                if (!handlers[event]) {
                    handlers[event] = {};
                    if (socketService.isConnected()) {
                        registerSocketEvent(event);
                    } else {
                        queuedRegistrations.push(event);
                    }
                }
                handlers[event][handlerRef] = handler;
                return handlerRef++;
            };

            this.unRegister = function(event, reference) {
                if (handlers[event] && handlers[event][reference]) {
                    delete handlers[event][reference];
                    if (Object.keys(handlers[event]).length === 0) {
                        delete handlers[event];
                        socketService.off(event);
                    }
                    return true;
                }
                return false;
            };

            var registerSocketEvent = function(event) {
                socketService.on(event, function(data) {
                    angular.forEach(handlers[event], function(handler) {
                        handler(event, data);
                    });
                });
            };

        }]);
