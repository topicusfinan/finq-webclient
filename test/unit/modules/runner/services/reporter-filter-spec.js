/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ReporterFilterService', function() {

    var reporterFilterService,
        reportMockData,
        STATE,
        backend;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, reporterFilter, reportServiceMock, config, _STATE_, story, storyServiceMock) {
        reporterFilterService = reporterFilter;
        reportMockData = reportServiceMock;
        backend = $httpBackend;
        STATE = _STATE_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            report: {pagination: {server: {reportsPerRequest: 2, maxTotalReports: 2}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/books').respond(200, storyServiceMock.books);
        config.load().then(function() {
            story.list();
        });
        $httpBackend.flush();
    }));

    it('should return an empty report list in case the service has not been initialized yet', function () {
        var filteredReports = reporterFilterService.getFilteredReports();
        expect(filteredReports.length).to.equal(0);
    });

    it('should return an full report list in case the service has been initialized and no filter was applied', function (done) {
        backend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=2&page=0').respond(200, reportMockData);
        reporterFilterService.initialize().then(function() {
            var filteredReports = reporterFilterService.getFilteredReports();
            expect(filteredReports.length).to.equal(reportMockData.data.length);
            done();
        });
        backend.flush();
    });

    it('should automatically initialize in case a filter is applied and it was not yet initialized', function (done) {
        backend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=2&page=0').respond(200, reportMockData);
        reporterFilterService.applyFilter().then(function(filteredReports) {
            expect(filteredReports.length).to.equal(reportMockData.data.length);
            done();
        });
        backend.flush();
    });

    it('should be able to filter on result status', function (done) {
        backend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=2&page=0').respond(200, reportMockData);
        reporterFilterService.applyFilter(['FAILED'],'').then(function(filteredReports) {
            expect(filteredReports.length).to.equal(1);
            done();
        });
        backend.flush();
    });

    it('should be able to reapply a previous filter', function (done) {
        backend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=2&page=0').respond(200, reportMockData);
        reporterFilterService.applyFilter(['FAILED'],'').then(function() {
            reporterFilterService.applyFilter().then(function(filteredReports) {
                expect(filteredReports.length).to.equal(1);
                done();
            });
        });
        backend.flush();
    });

});
