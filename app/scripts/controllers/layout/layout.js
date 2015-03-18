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
    .controller('LayoutCtrl', function ($timeout, sidebar) {
        var that = this;

        this.hasSidebar = function(){
            return sidebar.hasSidebar();
        };

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

    });
