'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:authServiceMock
 * @description
 * # FinqApp Mockservice - AppService
 *
 * Authentication mock service that provides user information.
 */
angular.module('finqApp.mock')
    .value('authServiceMock', {
        loginSuccess: {
            success: true,
            user: {
                name: 'Foo McFooson',
                first: 'Foo',
                last: 'McFooson'
            }
        },
        loginError: {
            success: false,
            error: 'AUTHENTICATION_FAILED'
        }
    });