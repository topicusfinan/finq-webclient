'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:ReportFilterCtrl
 * @description
 * # Running filter Controller
 *
 * This filter controller is used in the running stories section to filter the list of running stories.
 */
angular.module('finqApp.runner.controller')
    .controller('ReportFilterCtrl', ['STATE','$translate', function (STATE,$translate) {
        var that = this;

        that.statusPlaceholder = 'FILTERS.STATUSES.ANY';
        that.statuses = [
            {key: STATE.RUN.SCENARIO.SUCCESS,value: ''},
            {key: STATE.RUN.SCENARIO.FAILED,value: ''}
        ];

        angular.forEach(that.statuses, function(status) {
            $translate('STATE.RUN.'+status.key).then(function(translatedValue) {
                status.value = translatedValue;
            });
        });

    }]);
