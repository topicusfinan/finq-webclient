/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrl initialization', function() {

    var AvailableCtrl,
        MODULES,
        EVENTS,
        emitSpy,
        scope,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, _MODULES_, storyServiceMock) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        storybooks = storyServiceMock.books;
        emitSpy = sinon.spy(scope, '$emit');
        $httpBackend.expectGET('/story/list').respond(200, storybooks);
        AvailableCtrl = $controller('AvailableCtrl', {$scope: scope});
        $httpBackend.flush();
    }));

    it('should emit a navigation event', function () {
        expect(emitSpy).to.have.been.calledWith(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            section: MODULES.RUNNER.sections.AVAILABLE
        });
    });

    it('should have loaded the storybooks', function () {
        expect(scope.storybooks()).to.deep.equal(storybooks);
        expect(AvailableCtrl.storiesLoaded).to.be.true;
    });

    it('should have every item initially collapsed', function () {
        expect(scope.expand()).to.be.null;
    });

    it('should initially not have any item selected', function () {
        expect(AvailableCtrl.selectedItem).to.be.null;
    });

    it('should respond to an update filter request by setting the filter key', function () {
        var tagEventData = {id: 'tag', key: 1};
        scope.$emit(EVENTS.FILTER_SELECT_UPDATED,tagEventData);
        expect(AvailableCtrl.filterKeys[tagEventData.id]).to.equal(tagEventData.key);
    });

    it('should expand a book that is expanded', function () {
        AvailableCtrl.toggleExpand('book',storybooks[0].id);
        expect(scope.expand()).to.equal('book'+storybooks[0].id);
    });

    it('should collapse a book that is collapsed', function () {
        AvailableCtrl.toggleExpand('book',storybooks[0].id);
        AvailableCtrl.toggleExpand('book',storybooks[0].id);
        expect(scope.expand()).to.be.null;
    });

    it('should expand all books on request', function () {
        AvailableCtrl.toggleExpand('all');
        expect(scope.expand()).to.equal('all');
    });

    it('should expand a story on request', function () {
        AvailableCtrl.expandStory(storybooks[0].id,storybooks[0].stories[0].id);
        expect(scope.storybooks()[0].stories[0].expand).to.be.true;
        expect(AvailableCtrl.selectedItem).to.equal('story'+storybooks[0].stories[0].id);
    });

    it('should activate a story on request without expanding it in case its parent is already expanded', function () {
        AvailableCtrl.toggleExpand('book',storybooks[0].id);
        AvailableCtrl.expandStory(storybooks[0].id,storybooks[0].stories[0].id);
        expect(AvailableCtrl.selectedItem).to.equal('story'+storybooks[0].stories[0].id);
    });

});
