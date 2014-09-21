/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: StoryService initialization', function() {

    var storyService,
        storyMockData,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, story, storyServiceMock) {
        storyService = story;
        storyMockData = storyServiceMock.books;
        $httpBackend.expectGET('/story/list').respond(200, storyMockData);
        storyService.list().then(function(storyData) {
            storybooks = storyData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the storybook list', function () {
        expect(storybooks).to.not.be.undefined;
        expect(storybooks).to.not.be.empty;
        expect(storybooks[0]).to.deep.equal(storyMockData[0]);
    });

    it('should make it possible to list stories by referencing a book id', function () {
        var stories = storyService.listStoriesByBook([storybooks[0].id]);
        expect(stories).to.deep.equal(storybooks[0].stories);
    });

    it('should be possible to find a story by id', function () {
        var story = storyService.findStoryById(storybooks[0].stories[0].id);
        expect(story).to.deep.equal(storybooks[0].stories[0]);
    });

    it('should return null in case no story was found by id', function () {
        var story = storyService.findStoryById(null);
        expect(story).to.be.null;
    });

});

describe('Unit: StoryService initialization with an unstable backend', function() {

    var storyService,
        feedback;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, story) {
        storyService = story;
        $httpBackend.expectGET('/story/list').respond(503);
        storyService.list().then(null,function(error) {
            feedback = error;
        });
        $httpBackend.flush();
    }));

    it('should fail to load the storybooks', function () {
        expect(feedback).to.not.be.undefined;
    });

});
