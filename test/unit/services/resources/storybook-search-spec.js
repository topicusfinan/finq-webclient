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
    beforeEach(inject(function (_EVENTS_, _MODULES_, $httpBackend, config, storybookSearch, storyServiceMock) {
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        storybooks = storyServiceMock.books;
        storySearchService = storybookSearch;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            maxSearchResults: 1000
        });
        $httpBackend.expectGET('/app').respond(200);
        config.load().then(function() {
            storySearchService.initialize(storybooks);
        });
        $httpBackend.flush();
    }));

    it('should make it possible to search for a book after initialization of a storybook list', function () {
        var storybookIds = storySearchService.suggest('write');
        expect(storybookIds.length).to.equal(1);
    });

    it('should make it possible to search for a story after initialization of a storybook list', function () {
        var storybookIds = storySearchService.suggest('write');
        var storyIds = storySearchService.suggest('write',storybookIds[0]);
        expect(storyIds.length).to.equal(1);
        expect(storyIds[0]).to.not.equal(storybookIds[0]);
    });

    it('should return multiple books in case a search is executed that matches multiple books', function () {
        var storybookIds = storySearchService.suggest('a');
        expect(storybookIds.length).to.equal(2);
    });

    it('should not reinitialize in case not forced to do so', function () {
        storySearchService.initialize([]);
        var storybookIds = storySearchService.suggest('a');
        expect(storybookIds.length).to.equal(2);
    });

    it('should reinitialize in case it is forced to do so', function () {
        storySearchService.initialize([],true);
        var storybookIds = storySearchService.suggest('a');
        expect(storybookIds.length).to.equal(0);
    });

});
