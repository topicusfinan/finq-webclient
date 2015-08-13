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
    beforeEach(inject(function ($httpBackend, _$rootScope_, $run, runServiceMock, STATE, $config) {
        runService = $run;
        $rootScope = _$rootScope_;
        runMockData = runServiceMock;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            run: {pagination: {server: {runsPerRequest: 50}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/runs?status='+STATE.RUN.SCENARIO.RUNNING+'&size=50&page=0').respond(200, runMockData);
        $config.load().then(function() {
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

    it('should be able to validate if a run is completed', function () {
        var completed = runService.runIsCompleted(runs[0]);
        expect(completed).to.be.false;
    });

    it('should be able to find a particular story in a run', function () {
        var story = runService.findStoryInRun(runs[0],runs[0].stories[0].id);
        expect(story).to.not.be.null;
    });

    it('should be able to find a particular scenario in a story', function () {
        var scenario = runService.findScenarioInStory(runs[0].stories[0],runs[0].stories[0].scenarios[0].id);
        expect(scenario).to.not.be.null;
    });

    it('should be possible to not be able to find a scenario in a story', function () {
        var scenario = runService.findScenarioInStory(runs[0].stories[0],'test');
        expect(scenario).to.be.null;
    });

    it('should be able to remove a run from the current list of runs', function (done) {
        var runCountBefore = runs.length;
        var firstRunIdBefore = runs[0].id;
        runService.removeRun(runs[0].id);
        runService.list().then(function(reducedRuns) {
            expect(reducedRuns.length).to.equal(runCountBefore-1);
            expect(reducedRuns[0].id).to.not.equal(firstRunIdBefore);
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
    beforeEach(inject(function ($httpBackend, $run, STATE, $config) {
        runService = $run;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            run: {pagination: {server: {runsPerRequest: 50}}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/runs?status='+STATE.RUN.SCENARIO.RUNNING+'&size=50&page=0').respond(503);
        $config.load().then(function() {
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
