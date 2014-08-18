'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock
 * @description
 * # FinqApp Mockservice - AppService
 *
 * Mock the application service backend that provides general application data input.
 */
angular.module('finqApp.mock')
    .value('appServiceMock', {
        info: {
            title : 'Retail Banking'
        }
    });