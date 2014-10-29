'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:runningServiceMock
 * @description
 * # FinqApp Mockservice - Runningservice
 *
 * Mock the running story service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('runningServiceMock', {
        runs: [
            {
                id: 46432790,
                environment: 1,
                status: 0,
                stories: [
                    {
                        id: 46421532,
                        status: 0,
                        scenarios: [
                            {
                                id: 23452343,
                                status: 0,
                                steps: [
                                    {
                                        status: 1
                                    },
                                    {
                                        status: 1
                                    },
                                    {
                                        status: 0
                                    }
                                ]
                            },
                            {
                                id: 23452345,
                                status: 2,
                                steps: [
                                    {
                                        status: 1
                                    },
                                    {
                                        status: 2,
                                        message: 'Failed because it could'
                                    },
                                    {
                                        status: 3
                                    },
                                    {
                                        status: 3
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
