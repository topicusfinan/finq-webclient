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
    .controller('FeedbackCtrl', function ($scope, $timeout, $translate, EVENTS, FEEDBACK, $config) {
        var that = this,
            feedbackTimeout = null,
            parsingQueue = false,
            timeoutOverrulingType = null,
            queue = [],
            replaceTime = $config.client().feedback.replaceTime,
            cleanTimeout = $config.client().feedback.cleanTimeout,
            queueTimeout = $config.client().feedback.queueTimeout,
            minTimeout = $config.client().feedback.minTimeout;

        this.show = false;
        this.feedback = {
            message: '',
            type: ''
        };
        this.hide = function () {
            if (feedbackTimeout !== null) {
                clearTimeout(feedbackTimeout);
            }
            that.show = false;
        };

        $scope.$on(EVENTS.SCOPE.FEEDBACK, function (event, feedback) {
            handleFeedback(feedback.message, feedback.type, feedback.data, feedback.timeout);
        });

        var handleFeedback = function (feedbackTemplate, type, data, timeout) {
            var feedback = {};
            feedback.message = feedbackTemplate.key + ' (untranslated)';
            feedback.reference = feedbackTemplate.key;
            feedback.type = FEEDBACK.CLASS[type];
            feedback.data = data;
            feedback.tpl = feedbackTemplate;
            $translate('FEEDBACK.' + type + '.' + feedbackTemplate.key, data).then(function (translatedFeedback) {
                feedback.message = translatedFeedback;
            });
            if (that.show || parsingQueue) {
                clearOrUpdateQueued(FEEDBACK.TYPE.NOTICE);
                if (feedback.reference === that.feedback.reference && !queue.length) {
                    replaceFeedback(feedback, timeout);
                } else {
                    queueFeedback(type, feedback, timeout);
                }
            } else {
                $timeout(function () {
                    showFeedback(feedback, timeout);
                });
            }
        };

        var showFeedback = function (feedback, timeout) {
            that.show = true;
            that.feedback = feedback;
            if (!timeout && cleanTimeout !== null) {
                timeoutFeedback(cleanTimeout);
            } else if (timeout) {
                timeoutFeedback(timeout);
            }
        };

        var queueFeedback = function (type, feedback, timeout) {
            if (timeoutOverrulingType === null || (timeoutOverrulingType === FEEDBACK.TYPE.NOTICE && type !== FEEDBACK.TYPE.NOTICE)) {
                if (type !== FEEDBACK.TYPE.NOTICE) {
                    timeoutFeedback(minTimeout);
                } else {
                    timeoutFeedback(queueTimeout);
                }
                timeoutOverrulingType = type;
            }
            if (!clearOrUpdateQueued(type, feedback)) {
                queue.push({
                    feedback: feedback,
                    type: type,
                    timeout: timeout
                });
            }
        };

        var replaceFeedback = function (feedback, timeout) {
            $timeout(function () {
                that.hide();
            });
            $timeout(function () {
                showFeedback(feedback, timeout);
            }, replaceTime);
        };

        var timeoutFeedback = function (timeout) {
            if (feedbackTimeout !== null) {
                clearTimeout(feedbackTimeout);
            }
            feedbackTimeout = setTimeout(function () {
                timeoutOverrulingType = null;
                that.show = false;
                evaluateQueue();
            }, timeout);
        };

        var evaluateQueue = function () {
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
                replaceFeedback(queue[0].feedback, nextTimeout);
                queue.splice(0, 1);
                parsingQueue = false;
            }
        };

        var clearOrUpdateQueued = function (type, feedback) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i].type === type && (!feedback || queue[i].feedback.reference === feedback.reference)) {
                    if (feedback && feedback.tpl.incrementable) {
                        if (updateFeedback(queue[i], feedback)) {
                            return true;
                        }
                    }
                    queue.splice(i--, 1);
                    return false;
                }
            }
        };

        var updateFeedback = function (queuedItem, newFeedback) {
            var updated = true,
                updatedData = queuedItem.feedback.data;
            angular.forEach(newFeedback.data, function (value, key) {
                if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    updatedData[key] = updatedData[key] + value;
                } else if (updatedData[key] !== value) {
                    updated = false;
                }
            });
            var feedback = queuedItem.feedback;
            $translate('FEEDBACK.' + queuedItem.type + '.' + newFeedback.tpl.key, queuedItem.feedback.data).then(function (translatedFeedback) {
                feedback.message = translatedFeedback;
            });
            if (updated) {
                queuedItem.feedback.data = updatedData;
            }
            return updated;
        };

    });
