/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ReportService', function() {

    var reportService,
        runMockData,
        $rootScope,
        reports;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, _$rootScope_, report, runServiceMock, STATE, config) {
        reportService = report;
        $rootScope = _$rootScope_;
        runMockData = runServiceMock;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            report: {pagination: {server: {reportsPerRequest: 50, maxTotalReports: 500}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/run?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=50&page=0').respond(200, runMockData);
        config.load().then(function() {
            reportService.list().then(function(reportData) {
                reports = reportData;
            });
        });
        $httpBackend.flush();
    }));

    it('should properly load the reports list', function () {
        expect(reports).to.not.be.undefined;
        expect(reports).to.not.be.empty;
        expect(reports).to.deep.equal([
            {
                id: runMockData.data[0].id,
                status: runMockData.data[0].status,
                startedBy: runMockData.data[0].startedBy,
                startedOn: runMockData.data[0].startedOn,
                completedOn: runMockData.data[0].completedOn,
                environment: runMockData.data[0].environment
            }
        ]);
    });

    it('should retrieve a loaded report list in case the listing function is called again', function (done) {
        reportService.list().then(function(list) {
            expect(list).to.deep.equal([
                {
                    id: runMockData.data[0].id,
                    status: runMockData.data[0].status,
                    startedBy: runMockData.data[0].startedBy,
                    startedOn: runMockData.data[0].startedOn,
                    completedOn: runMockData.data[0].completedOn,
                    environment: runMockData.data[0].environment
                }
            ]);
            done();
        });
        $rootScope.$digest();
    });

});
