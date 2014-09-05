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
                        sets: [
                            1,
                            2
                        ],
                        tags: [
                            'book',
                            'customer'
                        ],
                        prologue: [
                            {
                                title: 'when a customer with id $customerId has been created',
                                template: 'when a customer with id $customerId has been created'
                            },
                            {
                                title: 'and a book with id $bookId is created with "my story" as a title, and value of EUR 30',
                                template: 'when a book with id $bookId is created with $title as a title, and a value of EUR $cost'
                            },
                            {
                                title: 'and a book with id $otherBookId is created with "my other story" as a title, and a value of EUR 20',
                                template: 'when a book with id $bookId is created with $title as a title, and a value of EUR $cost'
                            }
                        ],
                        epilogue: [],
                        scenarios: [
                            {
                                id: 23452343,
                                title: 'A customer adds a EUR 30 book to their empty basket',
                                steps: [
                                    {
                                        title: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                                        template: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId'
                                    },
                                    {
                                        title: 'then the [[products]] should be added to the basket with id $basketId',
                                        template: 'then the [[products]] should be added to the basket with id $basketId',
                                        products: {
                                            attributes: [
                                                'id',
                                                'value'
                                            ],
                                            values:
                                            [
                                                {
                                                    id: '$bookId',
                                                    value: 30
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        title: 'and the total value of the basket with id $basketId should be EUR 30',
                                        template: 'then the total value of the basket with id $basketId should be EUR $totalCost'
                                    }
                                ]
                            },
                            {
                                id: 23452345,
                                title: 'A customer adds an additional EUR 20 book to their basket',
                                steps: [
                                    {
                                        title: 'when the customer with id $customerId orders a new book with $bookId resulting in a basket with id $basketId',
                                        template: 'when the customer with id $customerId orders a new book with $bookId resulting in a basket with id $basketId'
                                    },
                                    {
                                        title: 'and the customer with id $customerId orders a new book with id $otherBookId',
                                        template: 'when the customer with id $customerId orders a new book with id $bookId'
                                    },
                                    {
                                        title: 'then the [[products]] should be added to the basket with id $basketId',
                                        template: 'then the [[products]] should be added to the basket with id $basketId',
                                        products: {
                                            attributes: [
                                                'id',
                                                'value'
                                            ],
                                            values:
                                            [
                                                {
                                                    id: '$bookId',
                                                    value: 30
                                                },
                                                {
                                                    id: '$otherBookId',
                                                    value: 20
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        title: 'and the total value of basket with id $basketId should be EUR 50',
                                        template: 'then the total value of the basket with id $basketId should be EUR $totalCost'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 56421532,
                        title: 'Cancelled orders',
                        sets: [
                            1
                        ],
                        tags: [
                            'book',
                            'customer',
                            'basket',
                            'cancel-order'
                        ],
                        prologue: [
                            {
                                title: 'when a customer with id $customerId has been created',
                                template: 'when a customer with id $customerId has been created'
                            },
                            {
                                title: 'and a book with id $bookId is created with "my story" as a title, and value of EUR 30',
                                template: 'when a book with id $bookId is created with $title as a title, and a value of EUR $cost'
                            },
                            {
                                title: 'and a book with id $otherBookId is created with "my other story" as a title, and a value of EUR 20',
                                template: 'when a book with id $bookId is created with $title as a title, and a value of EUR $cost'
                            },
                            {
                                title: 'and the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                                template: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId'
                            }
                        ],
                        epilogue: [],
                        scenarios: [
                            {
                                id: 33452343,
                                title: 'A customer removes the only item they have in their basket',
                                steps: [
                                    {
                                        title: 'when the customer with id $customerId removes a product with id $bookId from their basket with id $basketId',
                                        template: 'when the customer with id $customerId removes a product with id $productId from their basket with id $basketId'
                                    },
                                    {
                                        title: 'then the basket with id $basketId should be empty',
                                        template: null
                                    }
                                ]
                            },
                            {
                                id: 33452345,
                                title: 'A customer removes an item they have in their basket, but there are some left',
                                steps: [
                                    {
                                        title: 'when the customer with id $customerId orders a new book with id $otherBookId',
                                        template: 'when the customer with id $customerId orders a new book with id $bookId'
                                    },
                                    {
                                        title: 'and the customer with id $customerId removes a product with id $bookId from their basket with id $basketId',
                                        template: 'when the customer with id $customerId removes a product with id $productId from their basket with id $basketId'
                                    },
                                    {
                                        title: 'then the basket with id $basketId should contain the following [[products]]',
                                        template: 'then the basket with id $basketId should contain the following [[products]]',
                                        products: {
                                            attributes: [
                                                'id',
                                                'value'
                                            ],
                                            values:
                                            [
                                                {
                                                    id: '$otherBookId',
                                                    value: 20
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        title: 'and the total value of the basket with id $basketId should be EUR 20',
                                        template: 'then the total value of the basket with id $basketId should be EUR $totalCost'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 66432790,
                title: 'Story writing',
                stories: [
                    {
                        id: 66421532,
                        title: 'New stories',
                        sets: [
                            2
                        ],
                        tags: [
                            'book',
                            'customer',
                            'write'
                        ],
                        prologue: [
                            {
                                title: 'given that a role with authorization WRITE_STORY is available with id $roleId',
                                template: 'given that a role with authorization $key is available'
                            },
                            {
                                title: 'when a user with id $userId has been created',
                                template: 'when a user with id $userId has been created'
                            }
                        ],
                        epilogue: [],
                        scenarios: [
                            {
                                id: 63452343,
                                title: 'A user writes a new story and is allowed to do so',
                                steps: [
                                    {
                                        title: 'when the user with id $userId is given the role with id $roleId',
                                        template: 'when the user with id $userId is given the role with id $roleId'
                                    },
                                    {
                                        title: 'and the user with id $userId creates a new story with id $storyId',
                                        template: 'when the user with id $userId creates a new story with id $storyId'
                                    },
                                    {
                                        title: 'then the story with id $storyId should be available in the storylist',
                                        template: 'then the story with id $storyId should be available in the storylist'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
