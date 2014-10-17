'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:RadialProgress
 * @description
 * # Radial progress directive
 *
 * Use a radial progress indicator that works percentage based. Include the radial-progress class on a div element that
 * should render the progress indication and pass the progress through a bound "progress" attribute value.
 */
angular.module('finqApp.directive')
    .directive('radialProgress', function () {
        return {
            scope: {
                progress: '='
            },
            restrict: 'C',
            templateUrl: 'views/directives/radial-progress.html'
        };
    });
