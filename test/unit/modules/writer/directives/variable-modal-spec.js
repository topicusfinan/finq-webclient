/**
 * Created by marc.fokkert on 2-4-2015.
 */
'use strict';

describe('Unit: Variable modal controller', function () {
    beforeEach(module('finqApp'));
    var controller, scope, variableModalMock;
    var variable, simpleVariable, tableVariable;

    beforeEach(inject(function (storyServiceMock, storyVariable) {
        simpleVariable = angular.copy(storyServiceMock.books[0].stories[1].scenarios[1].steps[1].variables.input[0]);
        tableVariable = angular.copy(storyServiceMock.books[0].stories[1].scenarios[0].steps[1].variables.input[0]);

        storyVariable.setupVariable(simpleVariable);
        storyVariable.setupVariable(tableVariable);
    }));

    beforeEach(inject(function ($controller, $rootScope, variableModal) {
        scope = $rootScope.$new();
        variableModalMock = angular.copy(variableModal);
        sinon.spy(variableModalMock, 'setVisible');
        sinon.stub(variableModalMock, 'getVariable', function () {
            return variable;
        });

        controller = $controller('variableModalCtrl', {$scope: scope, variableModal: variableModalMock});
    }));

    it('should close the modal window when variable is null', function () {
        variable = null;
        scope.$digest();
        expect(variableModalMock.setVisible.calledWith(false));
        expect(controller.tabs.length).to.equal(0);
        expect(controller.variable).to.be.null();
    });

    it('should close the modal window when close is called', function () {
        variable = simpleVariable;
        scope.$digest();
        controller.close();

        expect(variableModalMock.setVisible.calledWith(false));
        expect(controller.tabs.length).to.equal(0);
        expect(controller.variable).to.be.null();
    });

    it('should display a table', function(){
        variable = tableVariable;
        scope.$digest();
        expect(variableModalMock.setVisible.calledWith(true));
        expect(controller.simple).to.be.false();

        // Should be the same, but not ===
        expect(controller.tabs).to.deep.equal(variable.table.tableData);
        expect(controller.tabs).to.not.equal(variable.table.tableData);
    });

    it('should display a simple variable', function(){
        variable = simpleVariable;
        scope.$digest();
        expect(variableModalMock.setVisible.calledWith(true));
        expect(controller.simple).to.be.true();

        // Should NOT be the same (different helper methods)
        expect(controller.variable).to.not.deep.equal(variable);
        expect(controller.variable).to.not.equal(variable);

        // Should have the same name and value
        expect(controller.variable.getSetValue()).to.equal(variable.getSetValue());
        expect(controller.variable.getSetName()).to.equal(variable.getSetName());
    });

    it('should add and remove tabs', function(){
        variable = tableVariable;
        scope.$digest();

        controller.addNewTab();
        // Verify tab has been added
        expect(controller.tabs.length).to.equal(3);
        expect(controller.visibleTab).to.equal(2);

        // Should be the same, but not ===
        expect(controller.tabs[2]).to.deep.equal(variable.table.tableHeader);
        expect(controller.tabs[2]).to.not.equal(variable.table.tableHeader);

        // Emulate deletion, given that the tab has to remain present on the index but be deleted.
        var tabs = angular.copy(controller.tabs);
        delete tabs[1];

        controller.removeTab(1);

        expect(controller.tabs.length).to.equal(3);
        expect(controller.tabs).to.deep.equal(tabs);
        expect(controller.visibleTab).to.equal(1);
    });

    it('should remove tabs when visible tab is 0', function(){
        variable = tableVariable;
        scope.$digest();

        scope.visibleTab = 0;
        controller.removeTab(0);
        expect(controller.visibleTab).to.equal(0);
    });

    it('should be able to persist a simple variable', function(){
        variable = simpleVariable;
        scope.$digest();

        controller.variable.getSetValue('foobar');
        controller.apply();
        expect(variable.getSetValue()).to.equal('foobar');
    });

    it('should be able to persist a table', function(){
        variable = tableVariable;
        scope.$digest();

        controller.tabs[1][0].value = 'foobar';
        controller.removeTab(0);
        controller.addNewTab();
        controller.apply();
        expect(variable.table.tableData[0][0].value).to.equal('foobar');
        expect(variable.table.tableData.length).to.equal(2);
    });

    it('should filter deleted tabs', function(){
        var tabs = tableVariable.table.tableData;
        delete tabs[1];
        expect(controller.ignoreUndefinedFilter(tabs[0])).to.be.true();
        expect(controller.ignoreUndefinedFilter(tabs[1])).to.be.false();
    });
});

describe('Unit: Variable modal directive', function () {
    beforeEach(module('finqApp'));
    var element, scope;
    var variableModal;
    beforeEach(module('views/modules/writer/directives/variable-modal.html'));

    beforeEach(inject(function ($compile, $rootScope, _variableModal_) {
        variableModal = _variableModal_;
        scope = $rootScope.$new();
        var template = "<div variable-modal></div>";
        template = $compile(template)(scope);

        scope.$digest();
        element = $(template);
    }));

    it('should hide or show the element depending on visibility', function () {
        expect(element.hasClass('ng-hide')).to.be.true();
        variableModal.setVisible(true);
        scope.$digest();
        expect(element.hasClass('ng-hide')).to.be.false();
    });

    it('should add the modal-wrapper class', function () {
        expect(element.hasClass('modal-wrapper')).to.be.true();
    });
});
