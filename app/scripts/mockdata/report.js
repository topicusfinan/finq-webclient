'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:reportServiceMock
 * @description
 * # FinqApp Mockservice - ReportService
 *
 * Mock the report service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('reportServiceMock', {
        totalCount: 2,
        page: 0,
        pageSize: 50,
        data: [
            {
                id: 46432790,
                environment: {
                    id: 1,
                    name: 'Chuck Norris'
                },
                startedOn: 1416138936000,
                completedOn: 1416138942000,
                startedBy: {
                    name: 'John Doe',
                    first: 'John',
                    last: 'Doe'
                },
                status: 'FAILED',
                stories: [
                    {
                        id: 46421532,
                        status: 'FAILED',
                        scenarios: [
                            {
                                id: 23452343,
                                status: 'SUCCESS',
                                steps: [
                                    {status: 'SUCCESS'},
                                    {status: 'SUCCESS'},
                                    {status: 'SUCCESS'}
                                ]
                            },
                            {
                                id: 23452345,
                                status: 'FAILED',
                                steps: [
                                    {status: 'SUCCESS'},
                                    {status: 'FAILED'},
                                    {status: 'SKIPPED'},
                                    {status: 'SKIPPED'}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 46432791,
                environment: {
                    id: 2,
                    name: 'Steven Seagal'
                },
                startedOn: 1416138831000,
                completedOn: 1416138842000,
                startedBy: {
                    name: 'Jane Doe',
                    first: 'Jane',
                    last: 'Doe'
                },
                status: 'SUCCESS',
                stories: [
                    {
                        id: 56421532,
                        status: 'SUCCESS',
                        scenarios: [
                            {
                                id: 33452343,
                                status: 'SUCCESS',
                                steps: [
                                    {status: 'SUCCESS'},
                                    {status: 'SKIPPED'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
