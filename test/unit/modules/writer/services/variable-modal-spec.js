'use strict';
/**
 * Created by marc.fokkert on 2-4-2015.
 */
describe('Unit: Variable modal service', function () {
    beforeEach(module('finqApp'));
    var variableModal;
    var simpleVariable;

    beforeEach(inject(function($variableModal, storyServiceMock){
        variableModal = $variableModal;
        simpleVariable = angular.copy(storyServiceMock.books[0].stories[1].scenarios[1].steps[1].variables.input[0]);
    }));

    it('should show a variable', function(){
        variableModal.showModalForVariable(simpleVariable);
        expect(variableModal.getVariable()).to.equal(simpleVariable);
        expect(variableModal.getVisible()).to.be.true();
    })

});
