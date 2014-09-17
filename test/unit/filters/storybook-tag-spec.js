/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Storybook Tag Filter execution', function() {

    var storybookTagFilter,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            storybookTagFilter = $injector.get('$filter')('storybookTagFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock) {
        storybooks = storyServiceMock.books;
    }));

    it('should keep all books and stories in case of a clear filter', function () {
        var filteredBooks = storybookTagFilter(storybooks,[]);
        expect(filteredBooks.length).to.equal(2);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[1].stories.length).to.equal(1);
        expect(filteredBooks[0].title).to.equal(storybooks[0].title);
        expect(filteredBooks[0].stories[0].title).to.equal(storybooks[0].stories[0].title);
        expect(filteredBooks[0].stories[1].title).to.equal(storybooks[0].stories[1].title);
        expect(filteredBooks[1].title).to.equal(storybooks[1].title);
        expect(filteredBooks[1].stories[0].title).to.equal(storybooks[1].stories[0].title);
    });

    it('should filter books but keep those that have at least one story that has the associated tag', function () {
        var filteredBooks = storybookTagFilter(storybooks,['basket']);
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[0].title).to.equal(storybooks[0].title);
    });

    it('should filter books in case an actual tag filter is used that excludes all stories in a book', function () {
        var filteredBooks = storybookTagFilter(storybooks,['write']);
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].stories.length).to.equal(1);
        expect(filteredBooks[0].title).to.equal(storybooks[1].title);
    });

});
