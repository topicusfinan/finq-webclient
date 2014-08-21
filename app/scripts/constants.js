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
        'RUNNER' : {
            id: 'RUNNER',
            title: 'Runner',
            badge: null,
            sections: {
                'AVAILABLE': {
                    id: 'RUNNER.AVAILABLE',
                    title: 'Available scenarios',
                    badge: null
                },
                'RUNNING': {
                    id: 'RUNNER.RUNNING',
                    title: 'Running',
                    badge: null
                },
                'DEBUGGING': {
                    id: 'RUNNER.DEBUGGING',
                    title: 'Debugging',
                    badge: null
                }
            }
        }
    });