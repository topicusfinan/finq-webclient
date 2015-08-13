'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:RunningFilterCtrl
 * @description
 * # Running filter Controller
 *
 * This filter controller is used in the running stories section to filter the list of running stories.
 */
angular.module('finqApp.runner.controller')
    .controller('RunningFilterCtrl', function ($environment) {
        var that = this;

        that.envPlaceholder = 'FILTERS.ENVIRONMENTS.ANY';

        $environment.list().then(function (environments) {
            that.environments = [];
            angular.forEach(environments, function(environment) {
                that.environments.push({
                    key: environment.id,
                    value: environment.name
                });
            });
        });

    });
