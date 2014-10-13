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
                name : 'Chuck Norris',
                address : ''
            },
            {
                id : 2,
                name : 'Steven Seagal',
                address : ''
            },
            {
                id : 3,
                name : 'Jason Statham',
                address : ''
            }
        ]
    });
