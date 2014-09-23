/**
 * @ngdoc overview
 * @name finqApp.constants
 * @description
 * # Application Constants
 *
 * All constants that are available on application level should be declared in this file.
 */

angular.module('finqApp')
    .constant('FEEDBACK', {
        'TYPE': {
            'SUCCESS': 'SUCCESS',
            'ERROR': 'ERROR',
            'ALERT': 'ALERT',
            'NOTICE': 'NOTICE'
        },
        'CLASS': {
            'SUCCESS': 'success',
            'ERROR': 'error',
            'ALERT': 'alert',
            'NOTICE': 'notice'
        },
        'ERROR': {
            'RUN': {
                'NO_ENVIRONMENT_SELECTED': 'RUN.NO_ENVIRONMENT_SELECTED',
                'REQUEST_FAILED': 'RUN.REQUEST_FAILED'
            },
            'SUBSCRIBE': {
                'SUBSCRIPTION_FAILED': 'SUBSCRIBE.SUBSCRIPTION_FAILED'
            }
        },
        'NOTICE': {
            'RUN': {
                'REQUEST_IS_TAKING_LONG': 'RUN.REQUEST_IS_TAKING_LONG'
            }
        },
        'ALERT': {
            'RUN': {
                'NO_SCENARIOS_SELECTED': 'RUN.NO_SCENARIOS_SELECTED'
            }
        },
        'SUCCESS': {
            'RUN': {
                'MULTIPLE_REQUEST': 'RUN.MULTIPLE_REQUEST',
                'SINGLE_REQUEST': 'RUN.SINGLE_REQUEST'
            }
        }
    });
