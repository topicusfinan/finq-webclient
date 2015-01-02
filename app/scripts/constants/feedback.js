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
                'NO_ENVIRONMENT_SELECTED': {'key':'RUN.NO_ENVIRONMENT_SELECTED'},
                'REQUEST_FAILED': {'key':'RUN.REQUEST_FAILED'},
                'COMPLETED': {
                    'SINGULAR': {'key': 'RUN.COMPLETED.SINGULAR'},
                    'PLURAL': {'key': 'RUN.COMPLETED.SINGULAR'}
                }
            },
            'REPORT': {
                'UNABLE_TO_LOAD': {'key':'REPORT.UNABLE_TO_LOAD'}
            },
            'SOCKET': {
                'UNABLE_TO_CONNECT': {'key': 'SOCKET.UNABLE_TO_CONNECT'},
                'UNABLE_TO_RECONNECT': {'key': 'SOCKET.UNABLE_TO_RECONNECT'}
            }
        },
        'NOTICE': {
            'RUN': {
                'REQUEST_IS_TAKING_LONG': {'key':'RUN.REQUEST_IS_TAKING_LONG'}
            },
            'SOCKET': {
                'RECONNECTING': {'key': 'SOCKET.RECONNECTING'},
                'RECONNECTED': {'key': 'SOCKET.RECONNECTED'}
            }
        },
        'ALERT': {
            'RUN': {
                'NO_STORIES_SELECTED': {'key':'RUN.NO_STORIES_SELECTED'}
            },
            'SOCKET': {
                'RECONNECTION_TROUBLE': {'key': 'SOCKET.RECONNECTION_TROUBLE'}
            }
        },
        'SUCCESS': {
            'RUN': {
                'MULTIPLE_REQUEST': {
                    'key':'RUN.MULTIPLE_REQUEST',
                    'incrementable': true
                },
                'SINGLE_REQUEST': {'key':'RUN.SINGLE_REQUEST'},
                'COMPLETED': {'key':'RUN.COMPLETED'}
            },
            'SOCKET': {
                'RECONNECTED': {'key': 'SOCKET.RECONNECTED'}
            }
        }
    });
