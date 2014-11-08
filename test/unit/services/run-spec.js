/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunService running stories', function() {

    var runService,
        runMockData,
        $rootScope,
        runs;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, _$rootScope_, run, runServiceMock, STATE) {
        runService = run;
        $rootScope = _$rootScope_;
        runMockData = runServiceMock;
        $httpBackend.expectGET('/run?status='+STATE.RUN.SCENARIO.RUNNING).respond(200, runMockData);
        runService.listRunningStories().then(function(runData) {
            runs = runData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the running stories list', function () {
        expect(runs).to.not.be.undefined;
        expect(runs).to.not.be.empty;
        expect(runs).to.deep.equal(runMockData.data);
    });

    it('should retrieve a loaded run list in case the listing function is called again', function (done) {
        runService.listRunningStories().then(function(list) {
            expect(list).to.deep.equal(runMockData.data);
            done();
        });
        $rootScope.$digest();
    });

});

describe('Unit: RunService run reports', function() {

    var runService,
        runMockData,
        $rootScope,
        runs;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, _$rootScope_, run, runServiceMock, STATE) {
        runService = run;
        $rootScope = _$rootScope_;
        runMockData = runServiceMock;
        $httpBackend.expectGET('/run?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED).respond(200, runMockData);
        runService.listReports().then(function(runData) {
            runs = runData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the run reports list', function () {
        expect(runs).to.not.be.undefined;
        expect(runs).to.not.be.empty;
        expect(runs).to.deep.equal(runMockData.data);
    });

    it('should retrieve a loaded report list in case the listing function is called again', function (done) {
        runService.listReports().then(function(list) {
            expect(list).to.deep.equal(runMockData.data);
            done();
        });
        $rootScope.$digest();
    });

});

describe('Unit: RunService with an unstable backend', function() {

    var runService,
        feedback;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, run, STATE) {
        runService = run;
        $httpBackend.expectGET('/run?status='+STATE.RUN.SCENARIO.RUNNING).respond(503);
        runService.listRunningStories().then(null,function(error) {
            feedback = error;
        });
        $httpBackend.flush();
    }));

    it('should fail to load the runs', function () {
        expect(feedback).to.not.be.undefined;
    });

});
