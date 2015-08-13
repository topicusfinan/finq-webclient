/**
 * Created by marc.fokkert on 4-3-2015.
 */
'use strict';

describe('Unit: Scenario view directive', function () {
    beforeEach(module('finqApp'));

    var selectedItem;
    var book, story, scenario, step;
    var book2, story2, scenario2, step2;

    beforeEach(inject(function (storyServiceMock) {
        book = storyServiceMock.books[0];
        story = book.stories[0];
        scenario = story.scenarios[0];
        step = scenario.steps[0];
        book2 = storyServiceMock.books[1];
        story2 = book2.stories[0];
        scenario2 = story2.scenarios[0];
        step2 = scenario2.steps[0];
    }));

    beforeEach(inject(function ($selectedItem) {
        selectedItem = $selectedItem;
    }));

    it('should set and match a book', function () {
        selectedItem.setSelectedItem(book);
        expect(selectedItem.isItemSelected(book)).to.be.true();
        expect(selectedItem.isItemSelected(book2)).to.be.false();
    });

    it('should set and match a story', function() {
        selectedItem.setSelectedItem(story);
        expect(selectedItem.isItemSelected(story)).to.be.true();
        expect(selectedItem.isItemSelected(story2)).to.be.false();

    });

    it('should set and match a scenario', function() {
        selectedItem.setSelectedItem(scenario);
        expect(selectedItem.isItemSelected(scenario)).to.be.true();
        expect(selectedItem.isItemSelected(scenario2)).to.be.false();

    });

    it('should set and match a step', function() {
        selectedItem.setSelectedItem(step);
        expect(selectedItem.isItemSelected(step)).to.be.true();
        expect(selectedItem.isItemSelected(step2)).to.be.false();
    });

    it('should be able to provide the currently selected item', function(){
        selectedItem.setSelectedItem(book);
        expect(selectedItem.getSelectedItem()).to.equal(book);
    });

    it('should be able to clear the currently selected item', function(){
        selectedItem.setSelectedItem(book);
        selectedItem.clearSelectedItem();
        expect(selectedItem.isItemSelected(book)).to.be.false();
        expect(selectedItem.getSelectedItem()).to.be.undefined();
    })
});
