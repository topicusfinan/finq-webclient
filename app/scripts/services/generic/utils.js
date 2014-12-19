'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:utils
 * @description
 * # Application utilities
 *
 * A service that provides general utilities for the application.
 */
angular.module('finqApp.service')
    .service('utils', function () {

        this.getTimeElapsed = function(now,past) {
            var deltaSec = Math.floor((now-past)/1000);
            var deltaMin = Math.floor(deltaSec/60);
            var seconds = deltaSec % 60;
            var minutes = deltaMin % 60;
            var hours = Math.floor(deltaMin/60);
            var timeElapsed = hours > 0 ? (hours < 10 ? '0' + hours : '' + hours) + ':' : '';
            timeElapsed += (minutes < 10 ? '0' + minutes : minutes) + ':';
            timeElapsed += seconds < 10 ? '0' + seconds : seconds;
            return timeElapsed;
        };

        this.pluralize = function(templateKey, values, interpret) {
            var targetTemplate,
                calculatedValue;
            if (typeof values === 'object') {
                for (var i=values.length-1; i>=0; i--) {
                    calculatedValue = Math.floor(interpret / values[i].actionValue);
                    if (calculatedValue > 1) {
                        targetTemplate = values[i].target+'.'+'PLURAL';
                        break;
                    }
                    if (calculatedValue === 1) {
                        targetTemplate = values[i].target+'.'+'SINGULAR';
                        break;
                    }
                    if (i === 0) {
                        targetTemplate = values[i].target+'.'+'PLURAL';
                    }
                }
            } else {
                if (interpret === 0 || interpret / values > 1) {
                    targetTemplate = 'PLURAL';
                } else {
                    targetTemplate = 'SINGULAR';
                }
                calculatedValue = interpret;
            }
            return {
                template: templateKey+'.'+targetTemplate,
                value: calculatedValue
            };
        };

    });
