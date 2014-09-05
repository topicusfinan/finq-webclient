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
        inject(function($injector){
            storybookTagFilter = $injector.get('$filter')('storybookTag');
        });
    });
    beforeEach(function() {
        storybooks = [
            {
                title: 'First book',
                stories: [
                    {
                        title: 'First story',
                        tags: ['test','tag']
                    },
                    {
                        title: 'Second story',
                        tags: ['test']
                    }
                ]
            },
            {
                title: 'Second book',
                stories: [
                    {
                        title: 'Third story',
                        tags: ['tag']
                    },
                    {
                        title: 'Fourth story',
                        tags: ['tag']
                    }
                ]
            }
        ];
    });

    it('should keep all books and stories in case of a clear filter', function () {
        var filteredBooks = storybookTagFilter(storybooks,null);
        expect(filteredBooks.length).to.equal(2);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[1].stories.length).to.equal(2);
        expect(filteredBooks[0].title).to.equal('First book');
        expect(filteredBooks[0].stories[0].title).to.equal('First story');
        expect(filteredBooks[0].stories[1].title).to.equal('Second story');
        expect(filteredBooks[1].title).to.equal('Second book');
        expect(filteredBooks[1].stories[0].title).to.equal('Third story');
        expect(filteredBooks[1].stories[1].title).to.equal('Fourth story');
    });

    it('should filter books in case an actual tag filter is used that excludes all stories in a book', function () {
        var filteredBooks = storybookTagFilter(storybooks,'test');
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[0].title).to.equal('First book');
    });

    it('should keep books in case at least one story in the book satisfies the filter', function () {
        var filteredBooks = storybookTagFilter(storybooks,'tag');
        expect(filteredBooks.length).to.equal(2);
        expect(filteredBooks[0].stories.length).to.equal(2);
        expect(filteredBooks[0].title).to.equal('First book');
        expect(filteredBooks[1].stories.length).to.equal(2);
        expect(filteredBooks[1].title).to.equal('Second book');
    });

});
