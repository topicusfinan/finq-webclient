'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:utils
 * @description
 * # Application utilities
 *
 * A service that provices general utilities for the application.
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

    });
