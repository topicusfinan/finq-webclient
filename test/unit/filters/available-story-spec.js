/**
 * Created by c.kramer on 9/6/2014.
 */
'use strict';

describe('Unit: Available Story Filter execution', function() {

    var availableStoryFilter,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            availableStoryFilter = $injector.get('$filter')('availableStoryFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock,storybookSearch) {
        storybooks = storyServiceMock.books;
        storybookSearch.initialize(storybooks);
    }));

    it('should return all stories in case of a clean filter combination', function () {
        var filteredStories = availableStoryFilter(storybooks[0].stories,'',storybooks[0].id,storybooks[0].stories[0].sets,[]);
        expect(filteredStories.length).to.equal(2);
    });

    it('should return a limited set of stories in case of a restricted filter combination on tags', function () {
        var filteredStories = availableStoryFilter(storybooks[0].stories,'',storybooks[0].id,storybooks[0].stories[0].sets,['additional']);
        expect(filteredStories.length).to.equal(1);
    });

    it('should return a limited set of stories in case of a restricted filter combination on search query', function () {
        var filteredStories = availableStoryFilter(storybooks[0].stories,'additional',storybooks[0].id,storybooks[0].stories[0].sets,[]);
        expect(filteredStories.length).to.equal(1);
    });

    it('should return a limited set of stories in case of a restricted filter combination on sets', function () {
        var filteredStories = availableStoryFilter(storybooks[0].stories,'',storybooks[0].id,['test'],[]);
        expect(filteredStories.length).to.equal(0);
    });

});
