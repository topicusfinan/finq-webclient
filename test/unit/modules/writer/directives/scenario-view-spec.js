/**
 * Created by marc.fokkert on 3-3-2015.
 */
'use strict';

describe('Unit: Scenario view directive', function () {
    beforeEach(module('finqApp'));

    var element, scope;
    var span, input;
    var scenarios;

    var titleInput;

    beforeEach(function () {
        scenarios = [
            {
                id: 1,
                title: "foo",
                steps: [
                    {
                        title: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                        template: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId'
                    }]

            }
        ];
    });

    beforeEach(module('views/modules/writer/directives/scenario-view.html'));


    beforeEach(inject(function ($rootScope, $compile) {
        var template = angular.element('<scenario-view scenarios="scenarios" ></div>');

        scope = $rootScope;
        scope.scenarios = scenarios;

        $compile(template)(scope);
        scope.$digest();
        element = $(template);
    }));

    beforeEach(function () {
        titleInput = element.find('input[ng-model="scenario.title"]');
    });

    //it('should save user input when the user clicks on apply', function () {
    //    scope.scenarios[0].editorTitle = 'foo';
    //    scope.$digest();
    //    expect(scope.scenarios[0].title).to.equal('foo');
    //    scope.scenarioView.applyScenarioTitle(scope.scenarios[0]);
    //    expect(scope.scenarios[0].title).to.equal('bar');
    //});


});
