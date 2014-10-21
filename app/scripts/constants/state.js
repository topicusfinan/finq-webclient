/**
 * @ngdoc overview
 * @name finqApp.constants:STATE
 * @description
 * # Application State constants
 *
 * A set of state constants to use throughout the application.
 */

angular.module('finqApp')
    .constant('STATE',{
        'RUN': {
            'SCENARIO': {
                'RUNNING': 0,
                'SUCCESS': 1,
                'FAILED': 2,
                'QUEUED': 3
            }
        }
    });
