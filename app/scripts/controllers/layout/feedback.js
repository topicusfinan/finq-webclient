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
            timeoutOverrulingType = null,
            queue = [],
            replaceTime = configProvider.client().feedback.replaceTime,
            cleanTimeout = configProvider.client().feedback.cleanTimeout,
            queueTimeout = configProvider.client().feedback.queueTimeout,
            minTimeout = configProvider.client().feedback.minTimeout;

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

        var handleFeedback = function(feedbackReference,type,data,timeout) {
            var feedback = {};
            feedback.message = feedbackReference+' (untranslated)';
            feedback.reference = feedbackReference;
            feedback.type = FEEDBACK.CLASS[type];
            $translate('FEEDBACK.'+type+'.'+feedbackReference,data).then(function (translatedFeedback) {
                feedback.message = translatedFeedback;
            });
            if (that.show || parsingQueue) {
                clearQueued(FEEDBACK.TYPE.NOTICE);
                if (feedback.reference === that.feedback.reference && !queue.length) {
                    replaceFeedback(feedback,timeout);
                } else {
                    queueFeedback(type,feedback,timeout);
                }
            } else {
                $timeout(function() {
                    showFeedback(feedback,timeout);
                });
            }
        };

        var showFeedback = function(feedback,timeout) {
            that.show = true;
            that.feedback = feedback;
            if (!timeout && cleanTimeout !== null) {
                timeoutFeedback(cleanTimeout);
            } else if (timeout) {
                timeoutFeedback(timeout);
            } else if (feedbackTimeout !== null) {
                clearTimeout(feedbackTimeout);
            }
        };

        var queueFeedback = function(type,feedback,timeout) {
            if (timeoutOverrulingType === null || (timeoutOverrulingType === FEEDBACK.TYPE.NOTICE && type !== FEEDBACK.TYPE.NOTICE)) {
                if (type !== FEEDBACK.TYPE.NOTICE) {
                    timeoutFeedback(minTimeout);
                } else {
                    timeoutFeedback(queueTimeout);
                }
                timeoutOverrulingType = type;
            }
            clearQueued(type,feedback.reference);
            queue.push({
                feedback: feedback,
                type: type,
                timeout: timeout
            });
        };

        var replaceFeedback = function(feedback,timeout) {
            $timeout(function() {
                that.hide();
            });
            $timeout(function() {
                showFeedback(feedback,timeout);
            },replaceTime);
        };

        var timeoutFeedback = function(timeout) {
            if (feedbackTimeout !== null) {
                clearTimeout(feedbackTimeout);
            }
            feedbackTimeout = setTimeout(function() {
                timeoutOverrulingType = null;
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
                replaceFeedback(queue[0].feedback,nextTimeout);
                queue.splice(0,1);
                parsingQueue = false;
            }
        };

        var clearQueued = function(type,reference) {
            for (var i=0; i<queue.length; i++) {
                if (queue[i].type === type && (!reference || queue[i].feedback.reference === reference)) {
                    queue.splice(i--,1);
                }
            }
        };

    }]);
