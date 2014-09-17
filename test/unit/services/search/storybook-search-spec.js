/**
 * Created by c.kramer on 9/9/2014.
 */
/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: StorybookSearch initialization', function() {

    var storySearchService,
        MODULES,
        EVENTS,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_EVENTS_, _MODULES_, storybookSearch, storyServiceMock) {
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        storybooks = storyServiceMock.books;
        storySearchService = storybookSearch;
    }));

    it('should make it possible to search for a book after initialization of a storybook list', function () {
        storySearchService.initialize(storybooks);
        var storybookIds = storySearchService.suggest('write');
        expect(storybookIds.length).to.equal(1);
    });

    it('should make it possible to search for a story after initialization of a storybook list', function () {
        storySearchService.initialize(storybooks);
        var storybookIds = storySearchService.suggest('write');
        var storyIds = storySearchService.suggest('write',storybookIds[0]);
        expect(storyIds.length).to.equal(1);
        expect(storyIds[0]).to.not.equal(storybookIds[0]);
    });

    it('should return multitple books in case a search is executed that matches multiple books', function () {
        storySearchService.initialize(storybooks);
        var storybookIds = storySearchService.suggest('a');
        expect(storybookIds.length).to.equal(2);
    });

    it('should not reinitialize in case not forced to do so', function () {
        storySearchService.initialize(storybooks);
        storySearchService.initialize([]);
        var storybookIds = storySearchService.suggest('a');
        expect(storybookIds.length).to.equal(2);
    });

    it('should reinitialize in case it is forced to do so', function () {
        storySearchService.initialize(storybooks);
        storySearchService.initialize([],true);
        var storybookIds = storySearchService.suggest('a');
        expect(storybookIds.length).to.equal(0);
    });

});
