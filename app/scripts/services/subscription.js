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

        this.subscribe = function(runId) {
            backend.get('/subscription/subscribe',{
                run: runId
            }).success(function() {
                // connect to websocket if not connected to retrieve update information
            }).error(function(error) {
                feedbackService.error(FEEDBACK.ERROR.SUBSCRIBE.SUBSCRIPTION_FAILED);
                console.debug(error);
            });
        };

    }]);
