'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:appServiceMock
 * @description
 * # FinqApp Mockservice - AppService
 *
 * Mock the application service backend that provides general application data input.
 */
angular.module('finqApp.mock')
    .value('appServiceMock', {
        info: {
            title : 'Finq',
            subject : 'Book store',
            authenticate: false
        }
    });
