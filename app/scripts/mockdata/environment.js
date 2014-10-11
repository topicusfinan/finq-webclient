'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:environmentServiceMock
 * @description
 * # FinqApp Mockservice - EnvironmentService
 *
 * Mock the environment service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('environmentServiceMock', {
        environments: [
            {
                id : 1,
                value : 'Chuck Norris',
                address : ''
            },
            {
                id : 2,
                value : 'Steven Seagal',
                address : ''
            },
            {
                id : 3,
                value : 'Jason Statham',
                address : ''
            }
        ]
    });
