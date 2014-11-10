/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunService', function() {

    var runService,
        runMockData,
        $rootScope,
        runs;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, _$rootScope_, run, runServiceMock, STATE, config) {
        runService = run;
        $rootScope = _$rootScope_;
        runMockData = runServiceMock;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            run: {pagination: {server: {runsPerRequest: 50}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/run?status='+STATE.RUN.SCENARIO.RUNNING+'&size=50&page=0').respond(200, runMockData);
        config.load().then(function() {
            runService.list().then(function(runData) {
                runs = runData;
            });
        });
        $httpBackend.flush();
    }));

    it('should properly load the running stories list', function () {
        expect(runs).to.not.be.undefined;
        expect(runs).to.not.be.empty;
        expect(runs).to.deep.equal(runMockData.data);
    });

    it('should retrieve a loaded run list in case the listing function is called again', function (done) {
        runService.list().then(function(list) {
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
    beforeEach(inject(function ($httpBackend, run, STATE, config) {
        runService = run;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            run: {pagination: {server: {runsPerRequest: 50}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/run?status='+STATE.RUN.SCENARIO.RUNNING+'&size=50&page=0').respond(503);
        config.load().then(function() {
            runService.list().then(null,function(error) {
                feedback = error;
            });
        });
        $httpBackend.flush();
    }));

    it('should fail to load the runs', function () {
        expect(feedback).to.not.be.undefined;
    });

});
