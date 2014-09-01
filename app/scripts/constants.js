/**
 * @ngdoc overview
 * @name finqApp.constants
 * @description
 * # Application Constants
 *
 * All constants that are available on application level should be declared in this file.
 */

angular.module('finqApp')
    .constant('EVENTS',{
        'PAGE_CONTROLLER_UPDATED': 'finqApp.pageControllerUpdated',
        'NAVIGATION_UPDATED' : 'finqApp.navigationUpdated',
        'CONFIG_LOADED' : 'finqApp.configLoaded'
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
