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
    .controller('LayoutCtrl', function ($timeout, sidebar, STATE) {
        var that = this;

        this.hasSidebar = function(){
            return sidebar.getStatus() !== STATE.SIDEBAR.HIDDEN;
        };

        this.sidebarIsExpanded = function() {
            return sidebar.getStatus() === STATE.SIDEBAR.EXPANDED;
        };

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

    });
