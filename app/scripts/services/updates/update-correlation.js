'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:updateCorrelation
 * @description
 * # Update Correlation service
 *
 * Correlate state updates received on the socket and enforce a view update heartbeat
 * depending on the type of event that is received.
 *
 */
angular.module('finqApp.service')
    .service('updateCorrelation', ['EVENTS', function (EVENTS) {
        var handlers = [];
        var correlatedRunUpdates = [];

        this.register = function(handler) {
            handlers.push(handler);
        };

        this.handleRunUpdate = function(runUpdateEvent, eventData) {
            var correlatedRunData = {
                id: eventData.id,
                status: eventData.status,
                stories: [
                    {
                        id: eventData.story.id,
                        status: eventData.story.status,
                        scenarios: [
                            {
                                id: eventData.story.scenario.id,
                                status: eventData.story.scenario.status,
                                steps: eventData.story.scenario.steps
                            }
                        ]
                    }
                ]
            };
            correlatedRunUpdates.push(correlatedRunData);
            publishCorrelatedRunEvent();
        };

        var publishCorrelatedRunEvent = function() {
            angular.forEach(handlers, function(handler) {
                for (var i=0; i<correlatedRunUpdates.length; i++) {
                    handler(EVENTS.SOCKET.RUN_STATUS_UPDATED, correlatedRunUpdates[i]);
                }
            });
            correlatedRunUpdates = [];
        };

    }]);
