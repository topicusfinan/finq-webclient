'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:RunningFilterCtrl
 * @description
 * # Running filter Controller
 *
 * This filter controller is used in the running stories section to filter the list of running stories.
 */
angular.module('finqApp.controller')
    .controller('RunningFilterCtrl', ['environment', function (environmentService) {
        var that = this;

        that.envPlaceholder = 'FILTERS.ENVIRONMENTS.DEFAULT_VALUE';

        environmentService.list().then(function (environments) {
            that.environments = environments;
        });

    }]);
