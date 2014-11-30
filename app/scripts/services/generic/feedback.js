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

        this.error = function(message,data,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.ERROR,message,data,timeout);
        };

        this.notice = function(message,data,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.NOTICE,message,data,timeout);
        };

        this.success = function(message,data,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.SUCCESS,message,data,timeout);
        };

        this.alert = function(message,data,timeout) {
            dispatchFeedback(FEEDBACK.TYPE.ALERT,message,data,timeout);
        };

        var dispatchFeedback = function(type,message,data,timeout) {
            var feedback = {
                message: message,
                type: type
            };
            if (data !== undefined) {
                feedback.data = data;
            }
            if (timeout !== undefined) {
                feedback.timeout = timeout;
            }
            $rootScope.$broadcast(EVENTS.SCOPE.FEEDBACK,feedback);
        };

    }]);
