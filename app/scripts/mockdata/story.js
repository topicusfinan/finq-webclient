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
                            {id:1},
                            {id:2}
                        ],
                        tags: [
                            {id:2},
                            {id:3}
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
                                tags: [],
                                variables: {input: [], output: []},
                                steps: [
                                    {
                                        id: 4,
                                        title: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                                        template: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                                        variables: {input: [], output: []}
                                    },
                                    {
                                        id: 5,
                                        title: 'then the [[products]] should be added to the basket with id $basketId',
                                        template: 'then the [[products]] should be added to the basket with id $basketId',
                                        variables: {input: [], output: []}

                                    },
                                    {
                                        id: 6,
                                        variables: {input: [], output: []},
                                        title: 'and the total value of the basket with id $basketId should be EUR 30',
                                        template: 'then the total value of the basket with id $basketId should be EUR $totalCost'
                                    }
                                ]
                            },
                            {
                                id: 23452345,
                                title: 'A customer adds an additional EUR 20 book to their basket',
                                variables: {input: [], output: []},
                                tags: [
                                    {id:1}
                                ],
                                steps: [
                                    {
                                        id: 7,
                                        title: 'when the customer with id $customerId orders a new book with $bookId resulting in a basket with id $basketId',
                                        template: 'when the customer with id $customerId orders a new book with $bookId resulting in a basket with id $basketId',
                                        variables: {input: [], output: []}
                                    },
                                    {
                                        id: 8,
                                        title: 'and the customer with id $customerId orders a new book with id $otherBookId',
                                        template: 'when the customer with id $customerId orders a new book with id $bookId',
                                        variables: {input: [], output: []}
                                    },
                                    {
                                        id: 9,
                                        title: 'then the [[products]] should be added to the basket with id $basketId',
                                        template: 'then the [[products]] should be added to the basket with id $basketId',
                                        variables: {input: [], output: []}
                                    },
                                    {
                                        variables: {input: [], output: []},
                                        id: 10,
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
                        variables: {input: [], output: []},
                        sets: [
                            {id:1}
                        ],
                        tags: [
                            {id:2},
                            {id:3},
                            {id:4},
                            {id:6}
                        ],
                        prologue: [
                            {
                                variables: {input: [], output: []},
                                title: 'when a customer with id $customerId has been created',
                                template: 'when a customer with id $customerId has been created'
                            },
                            {
                                variables: {input: [], output: []},
                                title: 'and a book with id $bookId is created with "my story" as a title, and value of EUR 30',
                                template: 'when a book with id $bookId is created with $title as a title, and a value of EUR $cost'
                            },
                            {
                                variables: {input: [], output: []},
                                title: 'and a book with id $otherBookId is created with "my other story" as a title, and a value of EUR 20',
                                template: 'when a book with id $bookId is created with $title as a title, and a value of EUR $cost'
                            },
                            {
                                title: 'and the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                                template: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                                variables: {input: [], output: []}

                            }
                        ],
                        epilogue: [],
                        scenarios: [
                            {
                                id: 33452343,
                                title: 'A customer removes the only item they have in their basket',
                                variables: {input: [], output: []},
                                tags: [],
                                steps: [
                                    {
                                        title: 'when the customer with id $customerId removes a product with id $bookId from their basket with id $basketId',
                                        template: 'when the customer with id $customerId removes a product with id $productId from their basket with id $basketId',
                                        variables: {input: [], output: []}

                                    },
                                    {
                                        title: 'then the basket with id $basketId should be empty',
                                        template: null,
                                        variables: {input: [], output: []}

                                    }
                                ]
                            },
                            {
                                id: 33452345,
                                title: 'A customer removes an item they have in their basket, but there are some left',
                                variables: {
                                    input: [
                                        {
                                            id: 531286,
                                            name: 'customerId',
                                            value: '313432'
                                        }
                                    ],
                                    output: [
                                        {
                                            id: -1,
                                            name: 'bar',
                                            reference: 321308
                                        }
                                    ]
                                },
                                tags: [],
                                steps: [
                                    {
                                        id: 32413,
                                        variables: {
                                            input: [],
                                            output: []
                                        },
                                        title: 'when the customer with id $customerId orders a new book with id $otherBookId',
                                        template: 'when the customer with id $customerId orders a new book with id $bookId'
                                    },
                                    {
                                        id: 1342321,
                                        title: 'and the customer with id $customerId removes a product with id $bookId from their basket with id $basketId',
                                        template: 'when the customer with id $customerId removes a product with id $productId from their basket with id $basketId',
                                        variables: {
                                            input: [
                                                {
                                                    id: 863154,
                                                    name: '$customerId',
                                                    reference: 531286
                                                },
                                                {
                                                    id: 45136,
                                                    name: '$productId',
                                                    value: '2341'
                                                },
                                                {
                                                    id: 648563,
                                                    name: '$basketId'
                                                }
                                            ],
                                            output: [
                                                {
                                                    id: 321308,
                                                    name: '#success'
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: 46845,
                                        title: 'then the basket with id $basketId should contain the following [[products]]',
                                        template: 'then the basket with id $basketId should contain the following [[products]]',
                                        variables: {
                                            input: [],
                                            output: []
                                        }
                                    },
                                    {
                                        id: 120349,
                                        title: 'and the total value of the basket with id $basketId should be EUR 20',
                                        template: 'then the total value of the basket with id $basketId should be EUR $totalCost',
                                        variables: {
                                            input: [],
                                            output: []
                                        }
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
                        variables: {input: [], output: []},
                        sets: [
                            {id:2}
                        ],
                        tags: [
                            {id:2},
                            {id:3},
                            {id:5}
                        ],
                        prologue: [
                            {
                                title: 'given that a role with authorization WRITE_STORY is available with id $roleId',
                                template: 'given that a role with authorization $key is available',
                                variables: {input: [], output: []}
                            },
                            {
                                title: 'when a user with id $userId has been created',
                                template: 'when a user with id $userId has been created',
                                variables: {input: [], output: []}
                            }
                        ],
                        epilogue: [],
                        scenarios: [
                            {
                                id: 63452343,
                                title: 'A user writes a new story and is allowed to do so',
                                tags: [],
                                steps: [
                                    {
                                        title: 'when the user with id $userId is given the role with id $roleId',
                                        template: 'when the user with id $userId is given the role with id $roleId',
                                        variables: {input: [], output: []}
                                    },
                                    {
                                        title: 'and the user with id $userId creates a new story with id $storyId',
                                        template: 'when the user with id $userId creates a new story with id $storyId',
                                        variables: {input: [], output: []}
                                    },
                                    {
                                        title: 'then the story with id $storyId should be available in the storylist',
                                        template: 'then the story with id $storyId should be available in the storylist',
                                        variables: {input: [], output: []}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
