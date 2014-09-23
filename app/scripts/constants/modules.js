/**
 * @ngdoc overview
 * @name finqApp.constants:MODULES
 * @description
 * # Application modules
 *
 * Contains a listing of all application modules and subsections to feed menus
 * and navigation.
 */

angular.module('finqApp')
    .constant('MODULES',{
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
