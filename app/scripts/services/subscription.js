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
    .service('subscription', ['backend','feedback','FEEDBACK',function (backend,feedbackService,FEEDBACK) {
        var subscriptions = [];

        this.subscribe = function(runId,updateHandler) {
            backend.get('/subscription/subscribe',{
                run: runId
            }).success(function() {
                subscriptions.push({
                    run: runId,
                    handler: updateHandler
                });
                // TODO interact with a websocket for the actual subscription info handling
                // when an update is received for a specific run, the handler should be called
                // with the update information for the subscription that matches the runId.
            }).error(function(error) {
                feedbackService.error(FEEDBACK.ERROR.SUBSCRIBE.SUBSCRIPTION_FAILED);
                console.debug(error);
            });
        };

    }]);
