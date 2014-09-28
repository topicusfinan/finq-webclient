/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunnerService', function() {

    var runnerService,
        moduleService,
        storyMockData,
        backend,
        EVENTS,
        MODULES;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, module, runner, _EVENTS_, _MODULES_, story, storyServiceMock) {
        runnerService = runner;
        moduleService = module;
        storyMockData = storyServiceMock.books;
        backend = $httpBackend;
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
        $httpBackend.expectGET('/story/list').respond(200, storyMockData);
        story.list();
        $httpBackend.flush();
    }));

    it('should handle a story run started event by requesting to update the module and section badges for running scenarios', function () {
        var sectionBadgeSpy = sinon.spy(moduleService, 'updateSectionBadge');
        var moduleBadgeSpy = sinon.spy(moduleService, 'updateModuleBadge');
        runnerService.handle(EVENTS.INTERNAL.SCENARIO_RUN_STARTED, {
            scenarios: [storyMockData[0].stories[0].scenarios[0].id,storyMockData[0].stories[0].scenarios[1].id]
        });
        sectionBadgeSpy.should.have.been.calledWith(MODULES.RUNNER.sections.RUNNING,2);
        moduleBadgeSpy.should.have.been.calledWith(MODULES.RUNNER,1);
    });

});
