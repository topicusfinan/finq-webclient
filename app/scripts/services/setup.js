'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:sectionState
 * @description
 * # Section state service
 *
 * Manage state and state indicators for sections. This can be used to update counters, badges
 * and other forms of state indicators for sections and modules.
 */
angular.module('finqApp.service')
    .service('$setup', function ($state, MODULES, $module, $runner, $socket, $story) {

        this.initialize = function () {
            $state.go('intro.loading');
        };

        this.finalize = function () {
            $module.linkModule(MODULES.RUNNER, $runner);
            $socket.connect();
            $story.list();
        };

    });
