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
                key : 1,
                value : 'Chuck Norris'
            },
            {
                key : 2,
                value : 'Steven Seagal'
            },
            {
                key : 3,
                value : 'Jason Statham'
            }
        ]
    });
