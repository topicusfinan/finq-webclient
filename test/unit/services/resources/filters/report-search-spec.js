/**
 * Created by c.kramer on 9/6/2014.
 */
'use strict';

describe('Unit: Report Search Filter execution', function() {

    var reportSearchFilter,
        reportSearchService,
        reportService,
        $q,
        STATE,
        $httpBackend,
        $timeout,
        $rootScope,
        reports;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            reportSearchFilter = $injector.get('$filter')('reportSearchFilter');
        });
    });
    beforeEach(inject(function (reportServiceMock,storyServiceMock,_$httpBackend_,report,config,reportSearch,story,_$q_,_STATE_,_$rootScope_,_$timeout_) {
        reportSearchService = reportSearch;
        $rootScope = _$rootScope_;
        reportService = report;
        $q = _$q_;
        $timeout = _$timeout_;
        STATE = _STATE_;
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            report: {pagination: {server: {reportsPerRequest: 2, maxTotalReports: 2}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/books').respond(200, storyServiceMock.books);
        $httpBackend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=2&page=0').respond(200, reportServiceMock);
        config.load().then(function() {
            story.list().then(function() {
                reportService.list().then(function(parsedReports){
                    reports = parsedReports;
                    // forcefully overwrite the report titles to avoid issues with the $translation module during tests
                    reports[0].title = 'story';
                    reports[1].title = 'book';
                });
            });
        });
        $httpBackend.flush();
    }));

    it('should keep all reports listed in case of an empty search', function () {
        reportSearchService.initialize(reports);
        var filteredReports = reportSearchFilter(reports,'');
        expect(filteredReports.length).to.equal(reports.length);
    });

    it('should eliminate books that do not have stories with a title that matches the query', function () {
        reportSearchService.initialize(reports);
        var filteredReports = reportSearchFilter(reports,'book');
        expect(filteredReports.length).to.equal(1);
        expect(filteredReports[0].title).to.equal(reports[1].title);
    });

});
