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
        var that = this,
            handlers = {},
            handlerRef = 0;

        this.subscribe = function(event, handler, eventData) {
            if (!socketService.isConnected()) {
                socketService.connect();
            }
            switch (event) {
                case EVENTS.SOCKET.RUN_STATUS_UPDATED:
                    socketService.emit(EVENTS.SOCKET.RUN_SUBSCRIBE,{
                        run: eventData.run
                    });
                    if (handler !== null && (!handlers[event] || !handlers[event].length)) {
                        that.register(event, handler);
                    }
                    break;
            }
        };

        this.register = function(event, handler) {
            if (!socketService.isConnected()) {
                socketService.connect();
            }
            if (!handlers[event]) {
                handlers[event] = {};
                registerSocketEvent(event);
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
