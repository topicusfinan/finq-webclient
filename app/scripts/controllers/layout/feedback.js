'use strict';

/**
 * @ngdoc overview
 * @name finqApp:FeedbackCtrl
 * @description
 * # Feedback controller
 *
 * Handle rendering and iteraction with user feedback.
 */
angular.module('finqApp.controller')
    .controller('FeedbackCtrl', [
        '$scope',
        '$translate',
        '$timeout',
        'config',
        'EVENTS',
        'FEEDBACK',
        function ($scope,$translate,$timeout,configProvider,EVENTS,FEEDBACK) {
        var that = this,
            feedbackTimeout = null;

        this.show = false;
        this.defaultTimeout = configProvider.client().feedbackTimeout;
        this.feedback = {
            message: '',
            type: ''
        };
        this.hide = function() {
            if (feedbackTimeout !== null) {
                $timeout.cancel(feedbackTimeout);
            }
            that.show = false;
        };

        $scope.$on(EVENTS.FEEDBACK,function(event,feedbackData) {
            showFeedback(feedbackData.message,feedbackData.type,feedbackData.timeout);
        });

        var showFeedback = function(feedbackMessage,type,timeout) {
            that.feedback.message = feedbackMessage+' (untranslated)';
            that.feedback.type = FEEDBACK.CLASS[type];
            $translate('FEEDBACK.'+type+'.'+feedbackMessage).then(function (translatedFeedback) {
                that.feedback.message = translatedFeedback;
            });
            that.show = true;
            if (timeout === undefined && that.defaultTimeout !== null) {
                timeoutFeedback(that.defaultTimeout);
            }
            else if (timeout) {
                timeoutFeedback(timeout);
            }
        };

        var timeoutFeedback = function(timeout) {
            if (feedbackTimeout !== null) {
                $timeout.cancel(feedbackTimeout);
            }
            feedbackTimeout = $timeout(function() {
                that.show = false;
            },timeout);
        };

    }]);
