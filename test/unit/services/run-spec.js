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
    beforeEach(inject(function ($httpBackend, _$rootScope_, run, runServiceMock) {
        runService = run;
        $rootScope = _$rootScope_;
        runMockData = runServiceMock.runs;
        $httpBackend.expectGET('/runs').respond(200, runMockData);
        runService.list().then(function(runData) {
            runs = runData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the running stories list', function () {
        expect(runs).to.not.be.undefined;
        expect(runs).to.not.be.empty;
        expect(runs).to.deep.equal(runMockData);
    });

    it('should retrieve a loaded run list in case the listing function is called again', function (done) {
        runService.list().then(function(list) {
            expect(list).to.deep.equal(runMockData);
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
    beforeEach(inject(function ($httpBackend, run) {
        runService = run;
        $httpBackend.expectGET('/runs').respond(503);
        runService.list().then(null,function(error) {
            feedback = error;
        });
        $httpBackend.flush();
    }));

    it('should fail to load the runs', function () {
        expect(feedback).to.not.be.undefined;
    });

});
