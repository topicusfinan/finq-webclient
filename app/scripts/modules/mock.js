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
    'environmentServiceMock',
    'authServiceMock',
    'storyServiceMock',
    'runnerMockSimulator',
    function($httpBackend,appServiceMock,setServiceMock,tagServiceMock,environmentServiceMock,authServiceMock,storyServiceMock,runnerMockSimulator) {

        $httpBackend.whenGET('/app').respond(appServiceMock.info);
        $httpBackend.whenGET('/sets').respond(setServiceMock.sets);
        $httpBackend.whenGET('/tags').respond(tagServiceMock.tags);
        $httpBackend.whenGET('/environments').respond(environmentServiceMock.environments);
        $httpBackend.whenGET('/books').respond(storyServiceMock.books);
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

/* jshint ignore:start */
var io = {
  connect: createMockSocketObject
};

function createMockSocketObject () {

    return {
        _listeners: {},
        on: function (ev, fn) {
            (this._listeners[ev] = this._listeners[ev] || []).push(fn);
        },
        once: function (ev, fn) {
            (this._listeners[ev] = this._listeners[ev] || []).push(fn);
            fn._once = true;
        },
        emit: function (ev, data) {
            var that = this;
            if (this._listeners[ev]) {
                this._listeners[ev].forEach(function (listener) {
                    if (listener._once) {
                        that.removeListener(ev, listener);
                    }
                    listener(data);
                });
            }
        },
        removeListener: function (ev, fn) {
            if (fn) {
                var index = this._listeners[ev].indexOf(fn);
                if (index > -1) {
                    this._listeners[ev].splice(index, 1);
                }
            } else {
                delete this._listeners[ev];
            }
        },
        removeAllListeners: function (ev) {
            if (ev) {
                delete this._listeners[ev];
            } else {
                this._listeners = {};
            }
        },
        disconnect: function () {}
    };

}
/* jshint ignore:end */
