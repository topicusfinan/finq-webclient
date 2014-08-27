'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:tagServiceMock
 * @description
 * # FinqApp Mockservice - Tagservice
 *
 * Mock the tag service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('tagServiceMock', {
        tags: [
            {
                key : 'financial-statement',
                value : 'Financial statement'
            },
            {
                key : 'customer',
                value : 'Customer'
            },
            {
                key : 'order',
                value : 'Order'
            }
        ]
    });
