/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ReportService', function() {

    var reportService,
        firstResponse,
        secondResponse,
        runData,
        $rootScope,
        $httpBackend,
        STATE,
        $q;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$httpBackend_, _$rootScope_, report, story, reportServiceMock, storyServiceMock, runServiceMock, _STATE_, config, _$q_) {
        reportService = report;
        $rootScope = _$rootScope_;
        reportServiceMock.pageSize = 1;
        firstResponse = angular.copy(reportServiceMock);
        secondResponse = angular.copy(reportServiceMock);
        firstResponse.data.splice(1,1);
        secondResponse.data.splice(0,1);
        secondResponse.page = 1;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        runData = runServiceMock.data;
        STATE = _STATE_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            report: {pagination: {server: {reportsPerRequest: 1, maxTotalReports: 2}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/books').respond(200, storyServiceMock.books);
        config.load().then(function() {
            story.list();
        });
        $httpBackend.flush();
    }));

    var loadReports = function(){
        var deferred = $q.defer();
        $httpBackend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=1&page=0').respond(200, firstResponse);
        $httpBackend.expectGET('/runs?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=1&page=1').respond(200, secondResponse);
        reportService.list().then(function(reports){
            deferred.resolve(reports);
        });
        $httpBackend.flush();

        return deferred.promise;
    };

    it('should properly load the reports list', function (done) {
        loadReports().then(function(reportData) {
            expect(reportData).to.not.be.undefined;
            expect(reportData).to.not.be.empty;
            expect(reportData).to.deep.equal([
                {
                    id: firstResponse.data[0].id,
                    status: firstResponse.data[0].status,
                    startedBy: firstResponse.data[0].startedBy,
                    startedOn: firstResponse.data[0].startedOn,
                    completedOn: firstResponse.data[0].completedOn,
                    runtime: '00:06',
                    environment: firstResponse.data[0].environment
                },
                {
                    id: secondResponse.data[0].id,
                    status: secondResponse.data[0].status,
                    startedBy: secondResponse.data[0].startedBy,
                    startedOn: secondResponse.data[0].startedOn,
                    completedOn: secondResponse.data[0].completedOn,
                    runtime: '00:11',
                    environment: secondResponse.data[0].environment
                }
            ]);
            done();
        });
        $rootScope.$digest();
    });

    it('should retrieve a loaded report list in case the listing function is called again', function (done) {
        loadReports().then(function(){
            reportService.list().then(function(list) {
                expect(list).to.deep.equal([
                    {
                        id: firstResponse.data[0].id,
                        status: firstResponse.data[0].status,
                        startedBy: firstResponse.data[0].startedBy,
                        startedOn: firstResponse.data[0].startedOn,
                        completedOn: firstResponse.data[0].completedOn,
                        runtime: '00:06',
                        environment: firstResponse.data[0].environment
                    },
                    {
                        id: secondResponse.data[0].id,
                        status: secondResponse.data[0].status,
                        startedBy: secondResponse.data[0].startedBy,
                        startedOn: secondResponse.data[0].startedOn,
                        completedOn: secondResponse.data[0].completedOn,
                        runtime: '00:11',
                        environment: secondResponse.data[0].environment
                    }
                ]);
                done();
            });
        });
        $rootScope.$digest();
    });

    it('should properly load the report list after it has received an individual report from the server', function(done){
        reportService.addNewReport(runData[0]);

        loadReports().then(function(reportData){
            expect(reportData).to.have.length(firstResponse.data.length + secondResponse.data.length);
            done();
        });
        $rootScope.$digest();
    });



});
