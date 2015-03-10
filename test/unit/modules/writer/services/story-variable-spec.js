/**
 * Created by marc.fokkert on 6-3-2015.
 */
'use strict';

describe('Unit: Scenario view directive', function () {
    beforeEach(module('finqApp'));

    var storyVariable;
    var book, story;

    beforeEach(inject(function (storyServiceMock) {
        book = storyServiceMock.books[0];
        story = book.stories[0];
    }));

    beforeEach(inject(function (_storyVariable_) {
        storyVariable = _storyVariable_;
    }));

    //it('should be able to look up a variable')


});
