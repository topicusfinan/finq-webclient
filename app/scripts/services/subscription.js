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
        'backend',
        'feedback',
        'FEEDBACK',
        'socket',
        'EVENTS',
        'module',
        function (backend,feedbackService,FEEDBACK,socketService,EVENTS,moduleService) {

        socketService.on(EVENTS.SOCKET.RUN_STATUS_UPDATED, function(data) {
            moduleService.handle(EVENTS.SOCKET.RUN_STATUS_UPDATED, data);
        });

        this.subscribe = function(runId) {
            socketService.emit(EVENTS.SOCKET.RUN_SUBSCRIBE,{
                run: runId
            });
        };

    }]);
