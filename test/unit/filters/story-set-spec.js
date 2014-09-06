/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Story Set Filter execution', function() {

    var storySetFilter,
        stories;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            storySetFilter = $injector.get('$filter')('storySetFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock) {
        stories = storyServiceMock.books[0].stories;
    }));

    it('should keep all stories in case of a clear filter', function () {
        var filteredStories = storySetFilter(stories,null);
        expect(filteredStories.length).to.equal(2);
        expect(filteredStories[0].title).to.equal(stories[0].title);
        expect(filteredStories[1].title).to.equal(stories[1].title);
    });

    it('should filter stories in case they do not match the filter', function () {
        var filteredStories = storySetFilter(stories,2);
        expect(filteredStories.length).to.equal(1);
        expect(filteredStories[0].title).to.equal(stories[0].title);
    });

});
