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
            feedbackTimeout = null,
            parsingQueue = false,
            overruledTimeout = null,
            queue = [],
            defaultTimeout = configProvider.client().feedbackTimeout,
            queueTimeout = configProvider.client().feedbackQueueTimeout,
            minTimeout = configProvider.client().minFeedbackTimeout;

        this.show = false;
        this.feedback = {
            message: '',
            type: ''
        };
        this.hide = function() {
            if (feedbackTimeout !== null) {
                clearTimeout(feedbackTimeout);
            }
            that.show = false;
        };

        $scope.$on(EVENTS.SCOPE.FEEDBACK,function(event,feedback) {
            handleFeedback(feedback.message,feedback.type,feedback.data,feedback.timeout);
        });

        var handleFeedback = function(feedbackMessage,type,data,timeout) {
            var feedback = {};
            feedback.message = feedbackMessage+' (untranslated)';
            feedback.type = FEEDBACK.CLASS[type];
            $translate('FEEDBACK.'+type+'.'+feedbackMessage,data).then(function (translatedFeedback) {
                feedback.message = translatedFeedback;
            });
            if (that.show || parsingQueue) {
                queueFeedback(type,feedback,timeout);
            } else {
                showFeedback(feedback,timeout);
            }
        };

        var showFeedback = function(feedback,timeout) {
            that.feedback = feedback;
            that.show = true;
            if (timeout === undefined && defaultTimeout !== null) {
                timeoutFeedback(defaultTimeout);
            } else if (timeout) {
                timeoutFeedback(timeout);
            } else {
                feedbackTimeout = null;
            }
            $scope.$apply();
        };

        var queueFeedback = function(type,feedback,timeout) {
            if (overruledTimeout === null || (overruledTimeout === FEEDBACK.TYPE.NOTICE && type !== FEEDBACK.TYPE.NOTICE)) {
                if (type !== FEEDBACK.TYPE.NOTICE) {
                    timeoutFeedback(minTimeout);
                } else {
                    timeoutFeedback(queueTimeout);
                }
                overruledTimeout = type;
            }
            queue.push({
                feedback: feedback,
                type: type,
                timeout: timeout
            });
        };

        var timeoutFeedback = function(timeout) {
            if (feedbackTimeout !== null) {
                clearTimeout(feedbackTimeout);
            }
            feedbackTimeout = setTimeout(function() {
                overruledTimeout = null;
                that.show = false;
                evaluateQueue();
            },timeout);
        };

        var evaluateQueue = function() {
            if (queue.length) {
                parsingQueue = true;
                var nextTimeout;
                if (queue.length > 1) {
                    if (queue[1].type !== FEEDBACK.TYPE.NOTICE) {
                        nextTimeout = minTimeout;
                    } else {
                        nextTimeout = queueTimeout;
                    }
                } else {
                    nextTimeout = queue[0].timeout;
                }
                showFeedback(queue[0].feedback,nextTimeout);
                queue.splice(0,1);
                parsingQueue = false;
            }
        };

    }]);
