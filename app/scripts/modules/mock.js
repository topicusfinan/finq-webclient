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
    'storyServiceMock',
    'authServiceMock', 
    function($httpBackend,appServiceMock,storyServiceMock,authServiceMock) {

        $httpBackend.whenGET('/app/info').respond(appServiceMock.info);
        $httpBackend.whenGET('/story/books').respond(storyServiceMock.storybooks);
        $httpBackend.whenGET('/auth/user').respond({user:null});
        $httpBackend.whenPOST('/auth/user').respond(authServiceMock.user);

        // Catch-all pass through for all other requests
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
    }]);
