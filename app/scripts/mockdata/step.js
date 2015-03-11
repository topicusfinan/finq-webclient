'use strict';
angular.module('finqApp.mock')
    .value('stepServiceMock', {
        steps: [
            {
                id: 21423,
                template: "when a $tester adds a $step",
                variables: [
                    {
                        input: [
                            {
                                id: 21423,
                                name: "tester"
                            }
                        ],
                        output: [
                            {
                                id: 2923,
                                name: "step"
                            }
                        ]
                    }
                ]
            },
            {
                id: 89234,
                template: "then $it should work",
                variables: [
                    {
                        input: [{
                            id: 12432,
                            name: "it"
                        }],
                        output: []
                    }
                ]
            }
        ]
    });
