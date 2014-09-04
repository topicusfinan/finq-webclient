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
    '$httpBackend',
    'appServiceMock',
    'setServiceMock',
    'tagServiceMock',
    'authServiceMock',
    'storyServiceMock',
    function($httpBackend,appServiceMock,setServiceMock,tagServiceMock,authServiceMock,storyServiceMock) {

        $httpBackend.whenGET('/app/info').respond(appServiceMock.info);
        $httpBackend.whenGET('/set/list').respond(setServiceMock.sets);
        $httpBackend.whenGET('/tag/list').respond(tagServiceMock.tags);
        $httpBackend.whenGET('/story/list').respond(storyServiceMock.books);
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
