'use strict';

describe('Unit: AppCtrl initialization', function() {

    var AppCtrl,
        scope;

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
    }));

    it('should set an initial title for the page', function () {
        expect(AppCtrl.title).to.equal('Finq');
    });

});

describe('Unit: AppCtrl receiving configuration loaded event', function() {

    var AppCtrl,
        EVENTS,
        scope,
        NEW_TITLE = 'Awesomeness';

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_) {
        EVENTS = _EVENTS_;
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
        scope.$broadcast(EVENTS.SCOPE.CONFIG_LOADED,{
            title: NEW_TITLE
        });
    }));

    it('should update the title with the configured title', function () {
        expect(AppCtrl.title).to.equal(NEW_TITLE);
    });

});

describe('Unit: AppCtrl receiving controller updated event', function() {

    var AppCtrl,
        EVENTS,
        MOD,
        scope,
        pageFactory,
        broadcastSpy,
        eventData;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_, MODULES, $page) {
        EVENTS = _EVENTS_;
        MOD = MODULES;
        pageFactory = $page;
        eventData = {
            module: MOD.RUNNER,
            section: MOD.RUNNER.sections.AVAILABLE
        };
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
        broadcastSpy = sinon.spy(scope, '$broadcast');
        scope.$emit(EVENTS.SCOPE.SECTION_STATE_CHANGED,eventData);
    }));

    it('should update the active module and section in the page factory', function () {
        var activeSection = pageFactory.getActiveSection();
        expect(activeSection.moduleId).to.equal(MOD.RUNNER.id);
        expect(activeSection.sectionId).to.equal(MOD.RUNNER.sections.AVAILABLE.id);
    });

});
