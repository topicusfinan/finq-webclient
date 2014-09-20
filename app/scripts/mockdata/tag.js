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
                key : 'additional',
                value : 'additional'
            },
            {
                key : 'book',
                value : 'book'
            },
            {
                key : 'customer',
                value : 'customer'
            },
            {
                key : 'basket',
                value : 'basket'
            },
            {
                key : 'write',
                value : 'write'
            },
            {
                key : 'cancel-order',
                value : 'cancel order'
            }
        ]
    });
