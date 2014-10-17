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
                if (interpret / values > 1) {
                    targetTemplate = 'PLURAL';
                } else {
                    targetTemplate = 'SINGULAR';
                }
            }
            return {
                template: templateKey+'.'+targetTemplate,
                value: calculatedValue
            };
        };

    });
