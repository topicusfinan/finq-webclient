/**
 * @ngdoc overview
 * @name finqApp.constants:EVENTS
 * @description
 * # Application Events
 *
 * Any event used throughout the application should be defined here as a constant.
 */

angular.module('finqApp')
    .constant('EVENTS',{
        'SCOPE': {
            'SECTION_STATE_CHANGED' : 'finqApp.scope.sectionStateChanged',
            'CONFIG_LOADED' : 'finqApp.scope.configLoaded',
            'SEARCH_UPDATED' : 'finqApp.scope.searchUpdated',
            'FILTER_SELECT_UPDATED' : 'finqApp.scope.filterSelectUpdated',
            'CONTENT_LIST_UPDATED' : 'finqApp.scope.contentListUpdated',
            'SYNCHRONIZE_FILTER': 'finqApp.scope.synchronizeFilter',
            'FEEDBACK': 'finqApp.scope.feedback',
            'SECTION_NOTIFICATIONS_UPDATED': 'finqApp.scope.sectionNofificationsUpdated',
            'MODULE_NOTIFICATIONS_UPDATED': 'finqApp.scope.moduleNotificationsUpdated'
        },
        'INTERNAL': {
            'STORY_RUN_STARTED': 'finqApp.internal.storyRunStarted'
        },
        'SOCKET': {
            'MAIN' : {
                'CONNECTED': 'connect',
                'RECONNECTED': 'reconnect',
                'RECONNECTING': 'reconnecting',
                'DISCONNECTED': 'disconnect',
                'ERROR': 'error',
                'RECONNECT_FAILED': 'reconnectFailed'
            },
            'RUN': {
                'UPDATED': 'run:progress',
                'SUBSCRIBE': 'run:subscribe',
                'UNSUBSCRIBE': 'run:unsubscribe',
                'GIST': 'run:gist',
                'NEW_REPORT': 'run:newReport'
            }
        }
    });
