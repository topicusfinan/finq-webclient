/**
 * Created by marc.fokkert on 16-4-2015.
 */
'use strict';

describe('Unit: Scenario variables view directive', function () {
    beforeEach(module('finqApp'));
    beforeEach(module('views/modules/writer/directives/scenario-variables-view.html'));

    var element, scope;
    var variable, step, scenario;
    var childScope;

    beforeEach(inject(function(storyServiceMock, $storyVariable){
        scenario = angular.copy(storyServiceMock.books[1].stories[0].scenarios[0]);
        step = scenario.steps[0];
        variable = step.variables.input[0];

        $storyVariable.setupVariables(scenario);
    }));

    beforeEach(inject(function($rootScope, $compile){
        var template = angular.element('<div scenario-variables-view></div>');

        scope = $rootScope.$new();
        element = $compile(template)(scope);
        scope.$digest();
        childScope = scope.$$childHead;
    }));

    it('should show variable modal when editing a variable', inject(function($variableModal){
        var showModalForVariable = sinon.spy($variableModal, 'showModalForVariable');

        childScope.scenarioVariablesView.editVariable(variable);
        expect(showModalForVariable).to.be.calledWith(variable);
    }));

    it('should update the variableScopes when a new item is selected', inject(function($selectedItem){
        $selectedItem.setSelectedItem(step);
        scope.$digest();

        expect(childScope.scenarioVariablesView.variableScopes.length).to.equal(2);
    }));

    it('should not update the variableScopes when no item is selected', inject(function($selectedItem){
        $selectedItem.clearSelectedItem();
        scope.$digest();

        expect(childScope.scenarioVariablesView.variableScopes.length).to.equal(0);
    }));

    it('should not show varibles on scenarios', inject(function($selectedItem){
        $selectedItem.setSelectedItem(scenario);
        scope.$digest();

        expect(childScope.scenarioVariablesView.variableScopes.length).to.equal(0);
    }));

});
