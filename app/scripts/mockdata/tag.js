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
                id : 1,
                key : 'additional',
                value : 'additional'
            },
            {
                id : 2,
                key : 'book',
                value : 'book'
            },
            {
                id : 3,
                key : 'customer',
                value : 'customer'
            },
            {
                id : 4,
                key : 'basket',
                value : 'basket'
            },
            {
                id : 5,
                key : 'write',
                value : 'write'
            },
            {
                id : 6,
                key : 'cancel-order',
                value : 'cancel order'
            }
        ]
    });
