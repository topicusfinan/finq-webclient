/**
 * Created by c.kramer on 9/6/2014.
 */
'use strict';

describe('Unit: Storybook Search Filter execution', function() {

    var storybookSearchFilter,
        storybookSearchService,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            storybookSearchFilter = $injector.get('$filter')('storybookSearchFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock,storybookSearch) {
        storybookSearchService = storybookSearch;
        storybooks = storyServiceMock.books;
        storybookSearch.initialize(storybooks);
    }));

    it('should keep all books listed in case of an empty search', function () {
        var filteredBooks = storybookSearchFilter(storybooks[0].stories,'');
        expect(filteredBooks.length).to.equal(2);
    });

    it('should eliminate books that do not have stories with a title that matches the query', function () {
        var filteredBooks = storybookSearchFilter(storybooks,'writes a new story');
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].title).to.equal(storybooks[1].title);
    });

    it('should prevent a second initialization if not forced', function () {
        storybookSearchService.initialize([]);
        var filteredBooks = storybookSearchFilter(storybooks,'writes a new story');
        expect(filteredBooks.length).to.equal(1);
    });

    it('should allow a second initialization if forced', function () {
        storybookSearchService.initialize([],true);
        var filteredBooks = storybookSearchFilter(storybooks,'writes a new story');
        expect(filteredBooks.length).to.equal(0);
    });

});
