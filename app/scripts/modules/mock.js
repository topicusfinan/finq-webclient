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
angular.module('finqApp.mock', []).config(['$provide', function ($provide) {
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
}]).run(
    function (STATE, $config, $httpBackend, $environment, $runnerMockSimulator, appServiceMock, setServiceMock, tagServiceMock, environmentServiceMock, authServiceMock, storyServiceMock, runServiceMock, reportServiceMock, stepServiceMock) {

        $httpBackend.whenGET('/app').respond(appServiceMock.info);
        $httpBackend.whenGET('/sets').respond(setServiceMock.sets);
        $httpBackend.whenGET('/tags').respond(tagServiceMock.tags);
        $httpBackend.whenGET('/steps').respond(stepServiceMock.steps);
        $httpBackend.whenGET('/environments').respond(environmentServiceMock.environments);
        $httpBackend.whenGET('/books').respond(storyServiceMock.books);
        $httpBackend.whenGET(/^\/runs\/[0-9]+/).respond(function (method, url) {
            var runId = parseInt(url.split('/')[2], 10);
            for (var i = 0; i < reportServiceMock.data.length; i++) {
                if (reportServiceMock.data[i].id === runId) {
                    return [200, reportServiceMock.data[i]];
                }
            }
            return [404, 'Report not found'];
        });
        $httpBackend.whenGET('/runs?status=' + STATE.RUN.SCENARIO.SUCCESS + '&status=' + STATE.RUN.SCENARIO.FAILED + '&size=50&page=0').respond(reportServiceMock);
        $httpBackend.whenGET('/runs?status=' + STATE.RUN.SCENARIO.RUNNING + '&size=50&page=0').respond(function () {
            var i, j, k, runningList = angular.copy(runServiceMock);
            for (i = 0; i < runningList.data.length; i++) {
                runningList.data[i].startedOn = (new Date()).getTime();
                var simulatorData = {
                    id: runningList.data[i].id,
                    startedOn: runningList.data[i].startedOn,
                    startedBy: runningList.data[i].startedBy,
                    environment: runningList.data[i].environment,
                    stories: []
                };
                for (j = 0; j < runningList.data[i].stories.length; j++) {
                    var scenarios = [];
                    for (k = 0; k < runningList.data[i].stories[j].scenarios.length; k++) {
                        scenarios.push(runningList.data[i].stories[j].scenarios[k].id);
                    }
                    simulatorData.stories.push({
                        id: runningList.data[i].stories[j].id,
                        scenarios: scenarios
                    });
                }
                $runnerMockSimulator.registerRun(simulatorData);
            }
            return [200, runningList];
        });
        $httpBackend.whenPOST('/run/stories').respond(function (method, url, data) {
            var jsonData = angular.fromJson(data);
            var runId = Math.floor((Math.random() * 10000) + 1);
            var startedOn = (new Date()).getTime();
            $runnerMockSimulator.registerRun(angular.extend(jsonData, {
                id: runId,
                startedBy: authServiceMock.user,
                environment: $environment.getById(jsonData.environment),
                startedOn: startedOn
            }));
            return [200, {
                id: runId,
                startedBy: authServiceMock.user,
                environment: jsonData.environment,
                startedOn: startedOn
            }];
        });
        var firstLoginAttempt = true;
        $httpBackend.whenGET('/users/current').respond(function () {
            if (firstLoginAttempt) {
                firstLoginAttempt = false;
                return [401, 'user not authorized'];
            }
            return [200, authServiceMock.user];
        });
        $httpBackend.whenPOST('/users/login').respond(function (method, url, data) {
            var jsonData = angular.fromJson(data);
            if (jsonData.email === 'admin@example.org' && jsonData.password === 'admin') {
                return [200, 'fake-authentication-token'];
            }
            return [401, authServiceMock.error];
        });

        // Catch-all pass through for all other requests
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
    });

angular.module('finqApp').requires.push('finqApp.mock');
