/**
 * Created by c.kramer on 9/6/2014.
 */
'use strict';

describe('Unit: Storybook Pagination Filter execution', function() {

    var storybookPaginationFilter,
        storybookSearchService,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            storybookPaginationFilter = $injector.get('$filter')('storybookPaginationFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock,storybookSearch) {
        storybooks = storyServiceMock.books;
        storybookSearchService = storybookSearch;
    }));

    it('should keep all books listed in case we allow a great lot of scenarios on one page', function () {
        var filteredBooks = storybookPaginationFilter(storybooks,0,1000);
        expect(filteredBooks.length).to.equal(storybooks.length);
        expect(storybookSearchService.hasMorePages).to.be.false;
    });

    it('should only allow the first book in case we only allow a single scenario on the first page', function () {
        var filteredBooks = storybookPaginationFilter(storybooks,0,1);
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].id).to.equal(storybooks[0].id);
        expect(storybookSearchService.hasMorePages).to.be.true;
    });

    it('should only allow the first book in case we only allow two scenarios on the first page', function () {
        var filteredBooks = storybookPaginationFilter(storybooks,0,2);
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].id).to.equal(storybooks[0].id);
        expect(storybookSearchService.hasMorePages).to.be.true;
    });

    it('should only allow the second book in case we only allow a single scenario on the second page', function () {
        var filteredBooks = storybookPaginationFilter(storybooks,1,1);
        expect(filteredBooks.length).to.equal(1);
        expect(filteredBooks[0].id).to.equal(storybooks[1].id);
        expect(storybookSearchService.hasMorePages).to.be.false;
    });

});
