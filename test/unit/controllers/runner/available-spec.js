/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrl', function() {

    var AvailableCtrl,
        httpBackend,
        MODULES,
        EVENTS,
        FEEDBACK,
        emitSpy,
        scope,
        environments,
        runnerFilterService,
        storyRunService,
        feedbackService,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, _MODULES_, _FEEDBACK_, config, environment, environmentServiceMock, storyServiceMock, storyRun, feedback, story, runnerFilter) {
        scope = $rootScope.$new();
        runnerFilterService = runnerFilter;
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
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/environments').respond(200, environments);
        $httpBackend.expectGET('/books').respond(200, storybooks);
        config.load().then(function() {
            environment.load().then(function() {
                story.list().then(function() {
                    AvailableCtrl = $controller('AvailableCtrl', {$scope: scope});
                    runnerFilter.initialize();
                });
            });
        });
        $httpBackend.flush();
    }));

    it('should initially not have any item selected', function () {
        expect(AvailableCtrl.selectedItem).to.be.null;
    });

    it('should respond to an update tag filter request by setting the filter keys', function () {
        var tagEventData = {id: 'tag', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,tagEventData);
        expect(AvailableCtrl.filter.tag.ids).to.deep.equal(tagEventData.keys);
    });

    it('should respond to an update set filter request by setting the filter keys', function () {
        var setEventData = {id: 'set', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,setEventData);
        expect(AvailableCtrl.filter.set.ids).to.deep.equal(setEventData.keys);
    });

    it('should respond to an update environement request by setting the environment keys', function () {
        var envEventData = {id: 'env', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,envEventData);
        expect(AvailableCtrl.filter.env.ids).to.deep.equal(envEventData.keys);
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
        var runSpy = sinon.spy(storyRunService, 'runStory');
        AvailableCtrl.filter.env.ids = [1];
        AvailableCtrl.run('scenario',scenarioId);
        runSpy.should.have.been.calledWith({
            story: storybooks[0].stories[0].id,
            scenarios: [storybooks[0].stories[0].scenarios[0].id]
        });
    });

    it('should be able to run a story by id in case an environment was selected', function () {
        var storyId = storybooks[0].stories[0].id;
        var runSpy = sinon.spy(storyRunService, 'runStory');
        var scenarioIds = [];
        for (var i=0; i<storybooks[0].stories[0].scenarios.length; i++) {
            scenarioIds.push(storybooks[0].stories[0].scenarios[i].id);
        }
        AvailableCtrl.filter.env.ids = [1];
        AvailableCtrl.run('story',storyId);
        expect(runSpy).to.have.been.calledWith({
            story: storyId,
            scenarios: scenarioIds
        });
    });

    it('should be able to run a storybook by id in case an environment was selected', function () {
        var bookId = storybooks[0].id;
        var runSpy = sinon.spy(storyRunService, 'runStories');
        var stories = [];
        for (var i=0; i<storybooks[0].stories.length; i++) {
            var story = {
                story: storybooks[0].stories[i].id,
                scenarios: []
            };
            for (var j=0; j<storybooks[0].stories[i].scenarios.length; j++) {
                story.scenarios.push(storybooks[0].stories[i].scenarios[j].id);
            }
            stories.push(story);
        }
        AvailableCtrl.filter.env.ids = [1];
        AvailableCtrl.run('book',bookId);
        expect(runSpy).to.have.been.calledWith(stories);
    });

    it('should be able to run all stories in case an environment was selected', function () {
        var runSpy = sinon.spy(storyRunService, 'runStories');
        var stories = [];
        for (var i=0; i<storybooks.length; i++) {
            for (var j=0; j<storybooks[i].stories.length; j++) {
                var story = {
                    story: storybooks[i].stories[j].id,
                    scenarios: []
                };
                for (var k=0; k<storybooks[i].stories[j].scenarios.length; k++) {
                    story.scenarios.push(storybooks[i].stories[j].scenarios[k].id);
                }
                stories.push(story);
            }
        }
        AvailableCtrl.filter.env.ids = [1];
        AvailableCtrl.run('all');
        expect(runSpy).to.have.been.calledWith(stories);
    });

    it('should be able to apply tag filters when executing a story', function () {
        var storyId = storybooks[0].stories[0].id;
        var runSpy = sinon.spy(storyRunService, 'runStory');
        var scenarioIds = [];
        for (var i=0; i<storybooks[0].stories[0].scenarios.length; i++) {
            for (var j=0; j<storybooks[0].stories[0].scenarios[i].tags.length; j++) {
                if (storybooks[0].stories[0].scenarios[i].tags[j].id === 1) {
                    scenarioIds.push(storybooks[0].stories[0].scenarios[i].id);
                }
            }
        }
        AvailableCtrl.filter.env.ids = [1];
        runnerFilterService.applyFilter([],[1]);
        AvailableCtrl.run('story',storyId);
        expect(runSpy).to.have.been.calledWith({
            story: storyId,
            scenarios: scenarioIds
        });
    });

    it('should be able to apply tag filters when running by books and all stories', function () {
        var runSpy = sinon.spy(storyRunService, 'runStories');
        var stories = [
            {story: 46421532, scenarios: [23452345]},
            {story: 66421532, scenarios: [63452343]},
        ];
        AvailableCtrl.filter.env.ids = [1];
        runnerFilterService.applyFilter([],[1,5]);
        AvailableCtrl.run('all');
        expect(runSpy).to.have.been.calledWith(stories);
    });

});
