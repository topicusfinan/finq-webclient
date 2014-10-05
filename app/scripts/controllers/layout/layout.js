'use strict';

/**
 * @ngdoc overview
 * @name finqApp:LayoutCtrl
 * @description
 * # Layout controller
 *
 * Handles the layout logic.
 */
angular.module('finqApp.controller')
    .controller('LayoutCtrl', ['$timeout',function ($timeout) {
        var that = this;

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

    }]);
