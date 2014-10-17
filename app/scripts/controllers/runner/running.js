'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:RunningCtrl
 * @description
 * # Running scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.controller')
    .controller('RunningCtrl', [
        '$scope',
        '$timeout',
        '$translate',
        'module',
        'EVENTS',
        'MODULES',
        'config',
        'runner',
        function ($scope,$timeout,$translate,moduleService,EVENTS,MODULES,configProvider,runnerService) {
        var that = this;

        this.selectedItem = null;
        this.maxSelectItems = configProvider.client().pagination.maxSelectDropdownItems;
        this.filter = {
            env: {id: 'env', keys: []}
        };

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            that.filter[filterInfo.id].keys = filterInfo.keys;
        });

        $scope.runs = runnerService.getRunningSessions;

        moduleService.setCurrentSection(MODULES.RUNNER.sections.RUNNING);

        var updateRunProgress = function() {
            var currentTime = new Date();
            angular.foreach($scope.runs, function(run) {
                var template,
                    timeDelta = parseInt((currentTime.getTime() - run.startedOn.getTime()) / 1000);
                if (timeDelta < 60) {
                    template = 'RUNNER.RUNNING.RUN.START_TIME.SECONDS';
                } else if (timeDelta < 3600) {
                    template = 'RUNNER.RUNNING.RUN.START_TIME.MINUTES';
                    timeDelta = parseInt(timeDelta / 60);
                } else {
                    template = 'RUNNER.RUNNING.RUN.START_TIME.HOURS';
                    timeDelta = parseInt(timeDelta / 3600);
                }
                $translate(template,{
                    delta: timeDelta
                }).then(function (translatedValue) {
                    run.startMsg = translatedValue;
                });
            });
            $timeout(updateRunProgress, configProvider.client().run.updateInterval);
        };

        updateRunProgress();

    }]);
