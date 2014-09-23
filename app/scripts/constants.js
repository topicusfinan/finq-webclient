/**
 * @ngdoc overview
 * @name finqApp.constants
 * @description
 * # Application Constants
 *
 * All constants that are available on application level should be declared in this file.
 */

angular.module('finqApp')
    .constant('CONFIG_CONSTANTS',{
        'MAX_SEARCH_RESULTS' : 1000
    })
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
    })
    .constant('EVENTS',{
        'SCOPE': {
            'SECTION_STATE_CHANGED' : 'finqApp.scope.sectionStateChanged',
            'CONFIG_LOADED' : 'finqApp.scope.configLoaded',
            'SEARCH_UPDATED' : 'finqApp.scope.searchUpdated',
            'FILTER_SELECT_UPDATED' : 'finqApp.scope.filterSelectUpdated',
            'CONTENT_LIST_UPDATED' : 'finqApp.scope.contentListUpdated',
            'SYNCHRONIZE_FILTER': 'finqApp.scope.synchronizeFilter',
            'FEEDBACK': 'finqApp.scope.feedback'
        },
        'INTERNAL': {
            'SCENARIO_RUN_STARTED': 'finqApp.internal.scenarioRunStarted'
        }
    }).constant('MODULES',{
        'REPORTER' : {
            id: 'REPORTER',
            sections: {
                'HISTORY': {
                    id: 'REPORTER.HISTORY'
                },
                'REPORTS': {
                    id: 'REPORTER.REPORTS'
                }
            }
        },
        'RUNNER' : {
            id: 'RUNNER',
            sections: {
                'AVAILABLE': {
                    id: 'RUNNER.AVAILABLE'
                },
                'RUNNING': {
                    id: 'RUNNER.RUNNING'
                },
                'DEBUGGING': {
                    id: 'RUNNER.DEBUGGING'
                }
            }
        },
        'ORGANIZER' : {
            id: 'ORGANIZER',
            sections: {
                'SETS': {
                    id: 'ORGANIZER.SETS'
                },
                'BOOKS': {
                    id: 'ORGANIZER.BOOKS'
                }
            }
        },
        'WRITER' : {
            id: 'WRITER',
            sections: {
                'STORIES': {
                    id: 'WRITER.STORIES'
                },
                'STEPS': {
                    id: 'WRITER.STEPS'
                }
            }
        }
    });
