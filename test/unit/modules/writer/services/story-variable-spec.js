/**
 * Created by marc.fokkert on 6-3-2015.
 */
'use strict';

describe('Unit: Scenario view directive', function () {
    beforeEach(module('finqApp'));

    var storyVariable, arrayOperations;
    var book, story, scenario1;

    beforeEach(inject(function (storyServiceMock) {
        book = $.extend(true, {}, storyServiceMock.books[0]);
        story = book.stories[1];
        scenario1 = story.scenarios[1];
    }));

    beforeEach(inject(function (_storyVariable_, _arrayOperations_) {
        storyVariable = _storyVariable_;
        arrayOperations = _arrayOperations_;
        storyVariable.setupVariables(scenario1);
    }));

    it('should be able to give step values', function(){
        expect(scenario1.steps[1].getInputVariables()[1].getValue()).to.equal('customerId');
        expect(scenario1.steps[1].getInputVariables()[0].getValue()).to.equal('foo');
    });

    it('should be able to register methods to a variable if it has been added later', function(){
        var newVariable = {
            name: 'foo',
            value: '1234156'
        };
        storyVariable.setupVariable(newVariable);
        arrayOperations.insertItem(scenario1.steps[1].getInputVariables(), 1, newVariable);
        expect(scenario1.steps[1].getInputVariables()[1].getValue()).to.not.be.undefined();
    });
    //
    it('should be able to register methods to a node if it has been added later', function(){
        var newNode = {
            title: 'foo',
            variables: {
                input: [],
                output: []
            },
            tags: [],
            steps: []
        };
        storyVariable.setupNode(newNode, scenario1);
        arrayOperations.insertItem(scenario1.steps, 1, newNode);
        expect(scenario1.steps[1].getInputVariables).to.not.be.undefined();
    });

    it('should be able to add input and output variables', function(){
        var newVariable = {
            value: 'testVariable'
        };
        scenario1.steps[1].addInputVariable(newVariable);
        expect(scenario1.steps[1].getInputVariables()[4].getValue()).to.equal('testVariable');
    });

    it('should mark fully resolved steps as complete', function(){
        expect(scenario1.steps[0].isIncomplete()).to.be.false();
        expect(scenario1.steps[2].isIncomplete()).to.be.false();
    });

    it('should mark incomplete steps as incomplete', function(){
        expect(scenario1.steps[1].isIncomplete()).to.be.true();
    });

    it('should give the previous step', function(){
        expect(scenario1.steps[1].getPreviousSibling()).to.equal(scenario1.steps[0]);
    });

    it('should be able to lookup a variable declared before the current step', function(){
        expect(scenario1.steps[1].getInputVariables()[0].getReferenceVariable()).to.equal(null);
        expect(scenario1.steps[1].getInputVariables()[1].getReferenceVariable()).to.equal(scenario1.steps[0].getOutputVariables()[0]);
    });

    it('should give null if no reference can be found', function(){
        expect(scenario1.steps[1].getInputVariables()[0].getReferenceVariable()).to.be.null();
    });

    it('should mark input variables that reference an output variable as linked', function(){
        expect(scenario1.steps[1].getInputVariables()[1].isLinked()).to.be.true();
        expect(scenario1.steps[1].getInputVariables()[0].isLinked()).to.be.false();
    });

    it('should mark output variables that are referenced by an input variable as linked', function(){
        expect(scenario1.steps[0].getOutputVariables()[0].isLinked()).to.be.true();
        expect(scenario1.steps[2].getOutputVariables()[0].isLinked()).to.be.false();
    });

    it('should get all child variables', function(){
        var outputVariables = scenario1.getAvailableOutputVariables();
        expect(outputVariables.length).to.equal(2);
    });





});
