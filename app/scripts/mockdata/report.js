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
                                title: 'A customer adds a EUR 30 book to their empty basket',
                                steps: [
                                    {status: 'SUCCESS', title: 'when a customer with id $customerId has been created'},
                                    {status: 'SUCCESS', title: 'and a book with id $bookId is created with "my story" as a title, and value of EUR 30'},
                                    {status: 'SUCCESS', title: 'and a book with id $otherBookId is created with "my other story" as a title, and a value of EUR 20'}
                                ]
                            },
                            {
                                id: 23452345,
                                status: 'FAILED',
                                title: 'A customer adds an additional EUR 20 book to their basket',
                                steps: [
                                    {status: 'SUCCESS', title: 'when the customer with id $customerId orders a new book with $bookId resulting in a basket with id $basketId'},
                                    {status: 'FAILED', title: 'and the customer with id $customerId orders a new book with id $otherBookId', message: 'A random assertion failed to validate'},
                                    {status: 'BLOCKED', title: 'then the [[products]] should be added to the basket with id $basketId'},
                                    {status: 'BLOCKED', title: 'and the total value of basket with id $basketId should be EUR 50'}
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
                                title: 'A customer removes the only item they have in their basket',
                                steps: [
                                    {status: 'SUCCESS', title: 'when the customer with id $customerId removes a product with id $bookId from their basket with id $basketId'},
                                    {status: 'SKIPPED', title: 'then the basket with id $basketId should be empty'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
