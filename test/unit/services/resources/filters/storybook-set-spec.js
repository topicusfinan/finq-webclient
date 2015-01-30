/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Storybook Set Filter execution', function() {

    var storybookSetFilter,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            storybookSetFilter = $injector.get('$filter')('storybookSetFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock) {
        storybooks = storyServiceMock.books;
    }));

    it('should keep all books and stories in case of a clear filter', function () {
        var filteredBooks = storybookSetFilter(storybooks,[]);
        expect(filteredBooks.length).to.equal(2);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[1].stories.length).to.equal(1);
        expect(filteredBooks[0].title).to.equal(storybooks[0].title);
        expect(filteredBooks[0].stories[0].title).to.equal(storybooks[0].stories[0].title);
        expect(filteredBooks[0].stories[1].title).to.equal(storybooks[0].stories[1].title);
        expect(filteredBooks[1].title).to.equal(storybooks[1].title);
        expect(filteredBooks[1].stories[0].title).to.equal(storybooks[1].stories[0].title);
    });

    it('should filter books in case an actual set filter is used that excludes all stories in a book', function () {
        var filteredBooks = storybookSetFilter(storybooks,[1]);
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[0].title).to.equal(storybooks[0].title);
    });

    it('should keep books in case at least one story in the book satisfies the filter', function () {
        var filteredBooks = storybookSetFilter(storybooks,[2]);
        expect(filteredBooks.length).to.equal(2);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[0].title).to.equal(storybooks[0].title);
        expect(filteredBooks[1].stories.length).to.equal(1);
        expect(filteredBooks[1].title).to.equal(storybooks[1].title);
    });

});
