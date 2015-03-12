/**
 * Created by marc.fokkert on 6-3-2015.
 */
'use strict';

describe('Unit: Scenario view directive', function () {
    beforeEach(module('finqApp'));

    var storyVariable;
    var book, story, scenario1;

    beforeEach(inject(function (storyServiceMock) {
        book = storyServiceMock.books[0];
        story = book.stories[1];
        scenario1 = story.scenarios[1];
    }));

    beforeEach(inject(function (_storyVariable_) {
        storyVariable = _storyVariable_;
        storyVariable.setupVariables(scenario1);
    }));

    it('should be able to give scenario variable names', function(){
        expect(scenario1.getInputVariables()[0].getName()).to.equal('customerId');
    });

    it('should be able to give step variable names', function(){
        expect(scenario1.steps[1].getInputVariables()[0].getName()).to.equal('$customerId');
    });

    it('should be able to give scenario values', function(){
        expect(scenario1.getInputVariables()[0].getActualValue()).to.equal('313432');
        expect(scenario1.getOutputVariables()[0].getActualValue()).to.equal(undefined);
    });

    it('should be able to give step values', function(){
        expect(scenario1.steps[1].getInputVariables()[1].getActualValue()).to.equal('2341');
        expect(scenario1.steps[1].getInputVariables()[0].getActualValue()).to.equal(undefined);
    });

    it('should be able to resolve scenario values', function(){
        expect(scenario1.getInputVariables()[0].getResolvedValue()).to.equal('313432');
        expect(scenario1.getOutputVariables()[0].getResolvedValue()).to.equal(undefined); // scenario output
    });

    it('should be able to resolve step values', function(){
        expect(scenario1.steps[1].getInputVariables()[1].getResolvedValue()).to.equal('2341');
        expect(scenario1.steps[1].getInputVariables()[0].getResolvedValue()).to.equal('313432');
    });

    it('should be able to get parent variable', function(){
        expect(scenario1.steps[1].getParent()).to.equal(scenario1);
    });
});
