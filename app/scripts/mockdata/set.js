'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:setServiceMock
 * @description
 * # FinqApp Mockservice - Setservice
 *
 * Mock the set service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('setServiceMock', {
        sets: [
            {
                key : 0,
                value : 'Nightly'
            },
            {
                key : 1,
                value : 'Regression'
            }
        ]
    });
