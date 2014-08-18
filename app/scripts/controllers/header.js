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
angular.module('finqApp')
    .controller('HeaderCtrl', ['$scope','config',function ($scope,configProvider) {
        $scope.title = configProvider.title();
    }]);
