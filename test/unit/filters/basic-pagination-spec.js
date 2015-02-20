/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Basic Pagination Filter execution', function() {

    var paginationFilter,
        items;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        inject(function($injector){
            paginationFilter = $injector.get('$filter')('basicPagination');
        });sd
    });
    beforeEach(inject(function () {
        items = [1,2,3,4,5,6];
    }));

    it('should keep all items if the maximum allowed is bigger than the total amount in the list', function () {
        var filteredItems = paginationFilter(items,0,10);
        expect(filteredItems.length).to.equal(6);
    });

    it('should keep only the amount that matches to the maximum allowed per page', function () {
        var filteredItems = paginationFilter(items,0,4);
        expect(filteredItems.length).to.equal(4);
        expect(filteredItems[3]).to.equal(items[3]);
    });

    it('should work with the iteration to determine the page and return results for that page', function () {
        var filteredItems = paginationFilter(items,1,4);
        expect(filteredItems.length).to.equal(2);
        expect(filteredItems[0]).to.equal(items[4]);
    });

});
