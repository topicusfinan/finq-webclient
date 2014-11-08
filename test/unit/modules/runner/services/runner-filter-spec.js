/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunnerFilterService', function() {

    var runnerFilterService,
        storyMockData,
        storybookSearchService,
        backend;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, runnerFilter, storyServiceMock, storybookSearch, config) {
        storybookSearchService = storybookSearch;
        runnerFilterService = runnerFilter;
        storyMockData = storyServiceMock.books;
        backend = $httpBackend;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            maxSearchResults: 200
        });
        $httpBackend.expectGET('/app').respond(200);
        config.load();
        $httpBackend.flush();
    }));

    it('should return an empty storybook list in case the service has not been initialized yet', function () {
        var filteredBooks = runnerFilterService.getFilteredStorybooks();
        expect(filteredBooks.length).to.equal(0);
    });

    it('should return an full storybook list in case the service has been initialized and no filter was applied', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.initialize().then(function() {
            var filteredBooks = runnerFilterService.getFilteredStorybooks();
            expect(filteredBooks.length).to.equal(storyMockData.length);
            done();
        });
        backend.flush();
    });

    it('should automatically initialize in case a filter is applied and it was not yet initialized', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter().then(function(filteredBooks) {
            expect(filteredBooks.length).to.equal(storyMockData.length);
            done();
        });
        backend.flush();
    });

    it('should be able to filter on a search query', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        storybookSearchService.query = 'additional';
        runnerFilterService.applyFilter().then(function(filteredBooks) {
            expect(filteredBooks.length).to.equal(1);
            expect(filteredBooks[0].stories.length).to.equal(1);
            expect(filteredBooks[0].stories[0].scenarios.length).to.equal(2);
            done();
        });
        backend.flush();
    });

    it('should be able to filter on tags', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter([],[1,4]).then(function(filteredBooks) {
            expect(filteredBooks.length).to.equal(1);
            expect(filteredBooks[0].stories.length).to.equal(2);
            expect(filteredBooks[0].stories[0].scenarios.length).to.equal(1);
            expect(filteredBooks[0].stories[1].scenarios.length).to.equal(2);
            done();
        });
        backend.flush();
    });

    it('should be able to filter on sets', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter([1],[]).then(function(filteredBooks) {
            expect(filteredBooks.length).to.equal(1);
            expect(filteredBooks[0].stories.length).to.equal(2);
            expect(filteredBooks[0].stories[0].scenarios.length).to.equal(2);
            expect(filteredBooks[0].stories[1].scenarios.length).to.equal(2);
            done();
        });
        backend.flush();
    });

    it('should be able to reapply a previous filter', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter([],[1,4]).then(function() {
            runnerFilterService.applyFilter().then(function(filteredBooks) {
                expect(filteredBooks.length).to.equal(1);
                expect(filteredBooks[0].stories.length).to.equal(2);
                expect(filteredBooks[0].stories[0].scenarios.length).to.equal(1);
                expect(filteredBooks[0].stories[1].scenarios.length).to.equal(2);
                done();
            });
        });
        backend.flush();
    });

    it('should be able retrieve filtered stories by book', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter([],[1]).then(function() {
            expect(runnerFilterService.getFilteredStoriesByBook(storyMockData[0].id).length).to.equal(1);
            expect(runnerFilterService.getFilteredStoriesByBook(storyMockData[1].id).length).to.equal(0);
            done();
        });
        backend.flush();
    });

    it('should be able retrieve filtered stories by all books', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter([],[1,5]).then(function() {
            expect(runnerFilterService.getFilteredStoriesByBook(null).length).to.equal(2);
            done();
        });
        backend.flush();
    });

    it('should be able retrieve filtered scenarios by story', function (done) {
        backend.expectGET('/books').respond(200, storyMockData);
        runnerFilterService.applyFilter([],[1]).then(function() {
            expect(runnerFilterService.getFilteredScenariosByStory(storyMockData[0].stories[0].id).length).to.equal(1);
            expect(runnerFilterService.getFilteredScenariosByStory(storyMockData[0].stories[1].id).length).to.equal(0);
            done();
        });
        backend.flush();
    });

});
