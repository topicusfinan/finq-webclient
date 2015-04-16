/**
 * Created by marc.fokkert on 3-3-2015.
 */
'use strict';

describe('Unit: Scenario view directive', function () {
    beforeEach(module('finqApp'));

    var element, scope;
    var scenarios;

    var titleInput;
    var childScope;

    beforeEach(module('views/modules/writer/directives/scenario-view.html'));

    beforeEach(inject(function (storyServiceMock) {
        scenarios = [angular.copy(storyServiceMock.books[0].stories[0].scenarios[0])];
    }));

    beforeEach(inject(function ($rootScope, $compile, storyVariable) {
        var template = angular.element('<scenario-view scenarios="scenarios" ></div>');
        storyVariable.setupVariables(scenarios[0]);

        scope = $rootScope.$new();
        scope.scenarios = scenarios;

        element = $compile(template)(scope);
        scope.$digest();

        childScope = element.scope().$$childHead;
    }));

    it('should provide a helper function for isIncomplete', function(){
        var isIncomplete = sinon.spy(scenarios[0].steps[0], 'isIncomplete');
        childScope.scenarioView.isStepIncomplete(scenarios[0].steps[0]);
        expect(isIncomplete).to.be.calledOnce;
    });

    it('should delete an item', inject(function(arrayOperations){
        var removeItem = sinon.spy(arrayOperations, 'removeItem');
        childScope.scenarioView.deleteItem(scenarios[0].steps, 0, scenarios[0].steps[0]);
        expect(scenarios[0].steps.length).to.equal(2);
        expect(removeItem).to.be.calledWith(scenarios[0].steps, 0);
    }));

    it('should delete a selected item', inject(function(selectedItem, arrayOperations){
        var clearSelectedItem = sinon.spy(selectedItem, 'clearSelectedItem');
        var removeItem = sinon.spy(arrayOperations, 'removeItem');
        selectedItem.setSelectedItem(scenarios[0].steps[0]);
        childScope.scenarioView.deleteItem(scenarios[0].steps, 0, scenarios[0].steps[0]);
        expect(clearSelectedItem).to.be.calledOnce;
        expect(removeItem).to.be.calledWith(scenarios[0].steps, 0);
    }))

});
