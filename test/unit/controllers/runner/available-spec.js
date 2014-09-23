/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrl initialization', function() {

    var AvailableCtrl,
        httpBackend,
        MODULES,
        EVENTS,
        FEEDBACK,
        emitSpy,
        scope,
        environments,
        storyRunService,
        feedbackService,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, _MODULES_, _FEEDBACK_, config, environment, environmentServiceMock, storyServiceMock, storyRun, feedback) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        FEEDBACK = _FEEDBACK_;
        storybooks = storyServiceMock.books;
        environments = environmentServiceMock.environments;
        httpBackend = $httpBackend;
        storyRunService = storyRun;
        feedbackService = feedback;
        emitSpy = sinon.spy(scope, '$emit');
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app/info').respond(200);
        $httpBackend.expectGET('/environment/list').respond(200, environments);
        httpBackend.expectGET('/story/list').respond(200, storybooks);
        config.load().then(function() {
            environment.load().then(function() {
                AvailableCtrl = $controller('AvailableCtrl', {$scope: scope});
            });
        });
        $httpBackend.flush();
    }));

    it('should have loaded the storybooks', function () {
        expect(AvailableCtrl.storiesLoaded).to.be.true;
    });

    it('should have every item initially collapsed', function () {
        expect(scope.expand()).to.be.null;
    });

    it('should initially not have any item selected', function () {
        expect(AvailableCtrl.selectedItem).to.be.null;
    });

    it('should respond to an update tag filter request by setting the filter keys', function () {
        var tagEventData = {id: 'tag', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,tagEventData);
        expect(AvailableCtrl.filter.tag.keys).to.deep.equal(tagEventData.keys);
    });

    it('should respond to an update set filter request by setting the filter keys', function () {
        var setEventData = {id: 'set', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,setEventData);
        expect(AvailableCtrl.filter.set.keys).to.deep.equal(setEventData.keys);
    });

    it('should respond to an update environement request by setting the environment keys', function () {
        var envEventData = {id: 'env', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,envEventData);
        expect(AvailableCtrl.filter.env.keys).to.deep.equal(envEventData.keys);
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
        expect(AvailableCtrl.selectedItem).to.equal('story'+storybooks[0].stories[0].id);
    });

    it('should activate a story on request without expanding it in case its parent is already expanded', function () {
        AvailableCtrl.toggleExpand('book',storybooks[0].id);
        AvailableCtrl.expandStory(storybooks[0].id,storybooks[0].stories[0].id);
        expect(AvailableCtrl.selectedItem).to.equal('story'+storybooks[0].stories[0].id);
    });

    it('should initially not have any more pages than the current page for pagination', function () {
        expect(AvailableCtrl.hasMorePages()).to.not.be.true;
    });

    it('should load a list of environments to populate the environment filter', function () {
        expect(AvailableCtrl.environments.length).to.equal(environments.length);
    });

    it('should trigger an error in case the user did not select an environment when attempting to run a scenario', function () {
        var scenarioId = storybooks[0].stories[0].scenarios[0].id;
        var feedbackSpy = sinon.spy(feedbackService, 'error');
        AvailableCtrl.run('scenario',scenarioId);
        expect(feedbackSpy).to.have.been.calledWith(FEEDBACK.ERROR.RUN.NO_ENVIRONMENT_SELECTED);
    });

    it('should be able to run a scenario by id in case an environment was selected', function () {
        var scenarioId = storybooks[0].stories[0].scenarios[0].id;
        var runSpy = sinon.spy(storyRunService, 'runScenario');
        AvailableCtrl.filter.env.keys = [1];
        AvailableCtrl.run('scenario',scenarioId);
        expect(runSpy).to.have.been.calledWith(scenarioId);
    });

    it('should be able to run a story by id in case an environment was selected', function () {
        var storyId = storybooks[0].stories[0].id;
        var runSpy = sinon.spy(storyRunService, 'runScenarios');
        var scenarioIds = [];
        for (var i=0; i<storybooks[0].stories[0].scenarios.length; i++) {
            scenarioIds.push(storybooks[0].stories[0].scenarios[i].id);
        }
        AvailableCtrl.filter.env.keys = [1];
        AvailableCtrl.run('story',storyId);
        expect(runSpy).to.have.been.calledWith(scenarioIds);
    });

    it('should be able to run a storybook by id in case an environment was selected', function () {
        var bookId = storybooks[0].id;
        var runSpy = sinon.spy(storyRunService, 'runScenarios');
        var scenarioIds = [];
        for (var i=0; i<storybooks[0].stories.length; i++) {
           for (var j=0; j<storybooks[0].stories[i].scenarios.length; j++) {
                scenarioIds.push(storybooks[0].stories[i].scenarios[j].id);
            }
        }
        AvailableCtrl.filter.env.keys = [1];
        AvailableCtrl.run('book',bookId);
        expect(runSpy).to.have.been.calledWith(scenarioIds);
    });

    it('should be able to run all stories in case an environment was selected', function () {
        var runSpy = sinon.spy(storyRunService, 'runScenarios');
        var scenarioIds = [];
        for (var i=0; i<storybooks.length; i++) {
            for (var j=0; j<storybooks[i].stories.length; j++) {
               for (var k=0; k<storybooks[i].stories[j].scenarios.length; k++) {
                    scenarioIds.push(storybooks[i].stories[j].scenarios[k].id);
                }
            }
        }
        AvailableCtrl.filter.env.keys = [1];
        AvailableCtrl.run('all');
        expect(runSpy).to.have.been.calledWith(scenarioIds);
    });

    it('should be able to apply tag filters when executing a story', function () {
        var storyId = storybooks[0].stories[0].id;
        var runSpy = sinon.spy(storyRunService, 'runScenarios');
        var scenarioIds = [];
        for (var i=0; i<storybooks[0].stories[0].scenarios.length; i++) {
            if (storybooks[0].stories[0].scenarios[i].tags.indexOf('additional') > -1) {
                scenarioIds.push(storybooks[0].stories[0].scenarios[i].id);
            }
        }
        AvailableCtrl.filter.env.keys = [1];
        AvailableCtrl.filter.tag.keys = ['additional'];
        AvailableCtrl.run('story',storyId);
        expect(runSpy).to.have.been.calledWith(scenarioIds);
    });

    it('should be able to apply tag filters when running by books and all stories', function () {
        var runSpy = sinon.spy(storyRunService, 'runScenarios');
        var scenarioIds = [];
        for (var i=0; i<storybooks.length; i++) {
            for (var j=0; j<storybooks[i].stories.length; j++) {
                var evaluate = true;
                if (storybooks[i].stories[j].tags.indexOf('write') > -1) {
                    evaluate = false;
                }
                for (var k=0; k<storybooks[i].stories[j].scenarios.length; k++) {
                    if (!evaluate || storybooks[i].stories[j].scenarios[k].tags.indexOf('additional') > -1) {
                        scenarioIds.push(storybooks[i].stories[j].scenarios[k].id);
                    }
                }
            }
        }
        AvailableCtrl.filter.env.keys = [1];
        AvailableCtrl.filter.tag.keys = ['write','additional'];
        AvailableCtrl.run('all');
        expect(runSpy).to.have.been.calledWith(scenarioIds);
    });

});
