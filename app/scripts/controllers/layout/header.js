'use strict';

/**
 * @ngdoc overview
 * @name finqApp:HeaderCtrl
 * @description
 * # Header controller
 *
 * The header controller handles the dynamic rendering of the application header, including the title to display,
 * the search function and the account control.
 */
angular.module('finqApp.controller')
    .controller('HeaderCtrl', ['$scope','$timeout','config',function ($scope,$timeout,configProvider) {
        var that = this,
            searchTimeout = null;
        this.title = configProvider.server().subject;
        this.timeout = configProvider.client().searchTimeout;
        this.query = '';

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

        this.search = function() {
            if (searchTimeout !== null) {
                $timeout.cancel(searchTimeout);
            }
            searchTimeout = $timeout(function() {
                console.log('searching with '+that.query);
            },that.timeout);
        };

    }]);
