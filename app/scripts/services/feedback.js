'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:feedback
 * @description
 * # User feedback service
 *
 * Handle the rendering of general user feedback messages.
 */
angular.module('finqApp.service')
    .service('feedback', ['$rootScope','EVENTS','FEEDBACK', function ($rootScope,EVENTS,FEEDBACK) {

        this.error = function(message,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.ERROR,message,timeout);
        };

        this.notice = function(message,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.NOTICE,message,timeout);
        };

        this.success = function(message,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.SUCCESS,message,timeout);
        };

        this.alert = function(message,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.ALERT,message,timeout);
        };

        var dispatchFeedback = function(type,message,timeout) {
            $rootScope.$broadcast(EVENTS.FEEDBACK,{
                message: message,
                type: type,
                timeout: timeout
            });
        };

    }]);
