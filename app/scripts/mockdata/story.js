'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:storyServiceMock
 * @description
 * # FinqApp Mockservice - Storyservice
 *
 * Mock the story service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('storyServiceMock', {
        books: [
            {
                id: 46432790,
                title: 'Financial Transactions',
                stories: [
                    {
                        id: 46421532,
                        title: 'New orders',
                        prologue: [
                            {
                                title: 'given a customer has been created',
                                pending: false
                            }
                        ],
                        scenarios: [
                            {
                                id: 23452343,
                                title: 'A customer adds a € 30 book to their empty shopping cart',
                                steps: [
                                    {
                                        title: 'given the customer orders a new book with a value of € 30',
                                        pending: false
                                    },
                                    {
                                        title: 'then a new shopping basket should be created with a total value of € 0',
                                        pending: false
                                    },
                                    {
                                        title: 'and the products should be added to their shopping basket',
                                        pending: false
                                    },
                                    {
                                        title: 'and the total value of their shopping basket should be € 30',
                                        pending: false
                                    }
                                ]
                            },
                            {
                                id: 23452345,
                                title: 'A customer adds an additional € 20 book to their shopping cart',
                                steps: [
                                    {
                                        title: 'given the customer orders a new book with a value of € 30',
                                        pending: false
                                    },
                                    {
                                        title: 'then the customer orders a new book with a value of € 20',
                                        pending: false
                                    },
                                    {
                                        title: 'then the products should be added to their shopping basket',
                                        pending: false
                                    },
                                    {
                                        title: 'and the total value of their shopping basket should be € 50',
                                        pending: false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 56421532,
                        title: 'Cancelled orders',
                        prologue: [
                            {
                                title: 'given a customer has been created',
                                pending: false
                            },
                            {
                                title: 'and the customer orders a new book with a value of € 30',
                                pending: false
                            }
                        ],
                        scenarios: [
                            {
                                id: 33452343,
                                title: 'A customer removes the only item they have in their shopping basket',
                                steps: [
                                    {
                                        title: 'given the customer removes a product from their shopping basket',
                                        pending: false
                                    },
                                    {
                                        title: 'then the shopping basket should be empty',
                                        pending: true
                                    }
                                ]
                            },
                            {
                                id: 23452343,
                                title: 'A customer removes an item they have in their shopping basket, but there are some left',
                                steps: [
                                    {
                                        title: 'given the customer orders a new book with a value of € 20',
                                        pending: false
                                    },
                                    {
                                        title: 'and the customer removes a product from their shopping basket',
                                        pending: false
                                    },
                                    {
                                        title: 'then the shopping basket should contain 1 item',
                                        pending: true
                                    },
                                    {
                                        title: 'and the total value of their shopping basket should be € 30',
                                        pending: false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    });
