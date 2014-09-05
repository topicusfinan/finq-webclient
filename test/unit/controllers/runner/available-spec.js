/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrl initialization', function() {

    var AvailableCtrl,
        MODULES,
        EVENTS,
        emitSpy,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_, _MODULES_) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        emitSpy = sinon.spy(scope, '$emit');
        AvailableCtrl = $controller('AvailableCtrl', {$scope: scope});
    }));

    it('should emit a navigation event', function () {
        expect(emitSpy).to.have.been.calledWith(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            section: MODULES.RUNNER.sections.AVAILABLE
        });
    });

});
