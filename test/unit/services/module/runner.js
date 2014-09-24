/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunnerService', function() {

    var runnerService,
        moduleService,
        EVENTS,
        MODULES;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function (module, runner, _EVENTS_, _MODULES_) {
        runnerService = runner;
        moduleService = module;
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
    }));

    it('should handle a scenario run started event by requesting to update the module and section badges for running scenarios', function () {
        var sectionBadgeSpy = sinon.spy(moduleService, 'updateSectionBadge');
        var moduleBadgeSpy = sinon.spy(moduleService, 'updateModuleBadge');
        runnerService.handle(EVENTS.INTERNAL.SCENARIO_RUN_STARTED, {
            scenarios: [1,2,3]
        });
        sectionBadgeSpy.should.have.been.calledWith(MODULES.RUNNER.sections.RUNNING,3);
        moduleBadgeSpy.should.have.been.calledWith(MODULES.RUNNER,1);
    });

});
