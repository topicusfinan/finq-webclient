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
    .service('subscription', ['backend','feedback','FEEDBACK','socket',function (backend,feedbackService,FEEDBACK,socketService) {
        var subscriptions = [];

        socketService.on('run:status', function(data) {
            angular.forEach(subscriptions, function(subscription) {
                if (subscription.run === data.id) {
                    subscription.handler(data.id,data.progress);
                }
            });
        });

        this.subscribe = function(runId,updateHandler) {
            socketService.emit('run:subscribe',{
                run: runId
            },function() {
                subscriptions.push({
                    run: runId,
                    handler: updateHandler
                });
            });
        };

    }]);
