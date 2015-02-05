/**
 * @ngdoc overview
 * @name finqApp.constants:STATE
 * @description
 * # Application State constants
 *
 * A set of state constants to use throughout the application.
 */

angular.module('finqApp')
    .constant('STATE', {
        'RUN': {
            'SCENARIO': {
                'RUNNING': 'RUNNING',
                'SUCCESS': 'SUCCESS',
                'FAILED': 'FAILED',
                'QUEUED': 'QUEUED',
                'SKIPPED': 'SKIPPED',
                'BLOCKED': 'BLOCKED'
            }
        }
    });
