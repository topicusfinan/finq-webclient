'use strict';

/**
 * @ngdoc overview
 * @name finqApp:LoginCtrl
 * @description
 * # Application login
 *
 * Present the user with a login screen that allows them to gain access to the Finq app.
 */
angular.module('finqApp')
    .controller('LoginCtrl', ['$state',function ($state) {
        if (1 === 0) {
            $state.go('authenticated');
        }
    }]);
