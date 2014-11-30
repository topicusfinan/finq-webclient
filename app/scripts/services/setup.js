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
    .service('setup', [
        '$state',
        'MODULES',
        'module',
        'runner',
        'socket',
        'story',
        function ($state,MODULES,moduleService,runnerService,socketService,storyService) {

            this.initialize = function() {
                $state.go('intro.loading');
            };

            this.finalize = function() {
                moduleService.linkModule(MODULES.RUNNER,runnerService);
                socketService.connect();
                storyService.list();
            };

        }]);
