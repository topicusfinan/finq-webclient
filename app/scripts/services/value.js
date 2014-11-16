'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:value
 * @description
 * # Value service
 *
 * Store application wide values in this generic value service
 */
angular.module('finqApp.service')
    .service('value', function () {
        // whether or not the application has multiple pages in the current pagination context
        this.hasMorePages = false;
    });
