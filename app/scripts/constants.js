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
    .constant('EVENTS',{
        'PAGE_CONTROLLER_UPDATED': 'finqApp.pageControllerUpdated',
        'NAVIGATION_UPDATED' : 'finqApp.navigationUpdated',
        'CONFIG_LOADED' : 'finqApp.configLoaded',
        'SEARCH_UPDATED' : 'finqApp.searchUpdated',
        'FILTER_SELECT_UPDATED' : 'finqApp.filterSelectUpdated',
        'CONTENT_LIST_UPDATED' : 'finqApp.contentListUpdated',
        'SYNCHRONIZE_ENVIRONMENTS': 'finqApp.synchronizeEnvironments'
    }).constant('MODULES',{
        'REPORTER' : {
            id: 'REPORTER',
            badge: null,
            sections: {
                'HISTORY': {
                    id: 'REPORTER.HISTORY',
                    badge: null
                },
                'REPORTS': {
                    id: 'REPORTER.REPORTS',
                    badge: null
                }
            }
        },
        'RUNNER' : {
            id: 'RUNNER',
            badge: null,
            sections: {
                'AVAILABLE': {
                    id: 'RUNNER.AVAILABLE',
                    badge: null
                },
                'RUNNING': {
                    id: 'RUNNER.RUNNING',
                    badge: null
                },
                'DEBUGGING': {
                    id: 'RUNNER.DEBUGGING',
                    badge: null
                }
            }
        },
        'ORGANIZER' : {
            id: 'ORGANIZER',
            badge: null,
            sections: {
                'SETS': {
                    id: 'ORGANIZER.SETS',
                    badge: null
                },
                'BOOKS': {
                    id: 'ORGANIZER.BOOKS',
                    badge: null
                }
            }
        },
        'WRITER' : {
            id: 'WRITER',
            badge: null,
            sections: {
                'STORIES': {
                    id: 'WRITER.STORIES',
                    badge: null
                },
                'STEPS': {
                    id: 'WRITER.STEPS',
                    badge: null
                }
            }
        }
    });
