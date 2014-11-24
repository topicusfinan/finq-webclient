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
                },
                'HISTORY': {
                    id: 'RUNNER.HISTORY'
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
