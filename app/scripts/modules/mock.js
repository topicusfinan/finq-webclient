'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock
 * @description
 * # FinqApp Mockservice
 *
 * The mock module includes the configuration for the handling of a mocked backend. This makes it possible
 * to develop the webclient without the need for a running backend. A hybrid is also allowed, which makes
 * it possible to mock certain requests, while letting other request be executed by an actual backend instance
 * to do so, comment the respective request below.
 */
angular.module('finqApp.mock',[]).config(['$provide', function($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }]).run([
    'STATE',
    'config',
    '$httpBackend',
    'appServiceMock',
    'setServiceMock',
    'tagServiceMock',
    'environmentServiceMock',
    'authServiceMock',
    'storyServiceMock',
    'runServiceMock',
    'runnerMockSimulator',
    function(STATE,configProvider,$httpBackend,appServiceMock,setServiceMock,tagServiceMock,environmentServiceMock,authServiceMock,storyServiceMock,runServiceMock,runnerMockSimulator) {

        $httpBackend.whenGET('/app').respond(appServiceMock.info);
        $httpBackend.whenGET('/sets').respond(setServiceMock.sets);
        $httpBackend.whenGET('/tags').respond(tagServiceMock.tags);
        $httpBackend.whenGET('/environments').respond(environmentServiceMock.environments);
        $httpBackend.whenGET('/books').respond(storyServiceMock.books);
        $httpBackend.whenGET('/run?status='+STATE.RUN.SCENARIO.SUCCESS+'&status='+STATE.RUN.SCENARIO.FAILED+'&size=50&page=0').respond([]);
        $httpBackend.whenGET('/run?status='+STATE.RUN.SCENARIO.RUNNING+'&size=50&page=0').respond(function() {
            var runningList = angular.copy(runServiceMock);
            runningList.data[0].startedOn = (new Date()).getTime();
            var simulatorData = {
                id: runningList.data[0].id,
                environment: runningList.data[0].environment,
                stories: []
            };
            angular.forEach(runningList.data[0].stories, function(story) {
                var scenarios = [];
                angular.forEach(story.scenarios, function(scenario) {
                    scenarios.push(scenario.id);
                });
                simulatorData.stories.push({
                    id: story.id,
                    scenarios: scenarios
                });
            });
            runnerMockSimulator.registerRun(simulatorData);
            return [200,runningList];
        });
        $httpBackend.whenPOST('/run/stories').respond(function(method, url, data) {
            var jsonData = angular.fromJson(data);
            var runId = Math.floor((Math.random() * 10000) + 1);
            runnerMockSimulator.registerRun(angular.extend(jsonData,{
                id: runId
            }));
            return [200,{
                id: runId,
                startedBy: authServiceMock.user,
                environment: jsonData.environment
            }];
        });
        $httpBackend.whenGET('/auth/user').respond(401);
        $httpBackend.whenPOST('/auth/login').respond(function(method, url, data) {
            var jsonData = angular.fromJson(data);
            if (jsonData.email === 'admin@example.org' && jsonData.password === 'admin') {
                return [200,authServiceMock.user];
            }
            return [401,authServiceMock.error];
        });

        // Catch-all pass through for all other requests
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
    }]);

angular.module('finqApp').requires.push('finqApp.mock');
