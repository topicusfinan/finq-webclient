/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrl initialization with a set host', function() {

    var AvailableFilterCtrl,
        EVENTS,
        scope,
        environments,
        sets,
        tags;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, config, host, environment, environmentServiceMock, setServiceMock, tagServiceMock) {
        scope = $rootScope.$new();
        EVENTS = _EVENTS_;
        host.setHost({address: ''});
        environments = environmentServiceMock.environments;
        sets = setServiceMock.sets;
        tags = tagServiceMock.tags;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app/info').respond(200);
        $httpBackend.expectGET('/environment/list').respond(200, environments);
        $httpBackend.expectGET('/set/list').respond(200, sets);
        $httpBackend.expectGET('/tag/list').respond(200, tags);
        config.load().then(function() {
            environment.load().then(function() {
                AvailableFilterCtrl = $controller('AvailableFilterCtrl', {$scope: scope});
            });
        });
        $httpBackend.flush();
    }));

    it('should load a list of environments to populate the environment filter', function () {
        expect(AvailableFilterCtrl.environments.list.length).to.equal(environments.length + 1);
    });

    it('should add a default filter item to the environments list', function () {
        expect(AvailableFilterCtrl.environments.list[0].key).to.be.null;
        expect(AvailableFilterCtrl.environments.list[1]).to.deep.equal(environments[0]);
    });

    it('should set the current active environment filter to the default value', function () {
        expect(AvailableFilterCtrl.environments.active).to.deep.equal({key: null, value: ''});
    });

    it('should load a list of sets to populate the set filter', function () {
        expect(AvailableFilterCtrl.sets.list.length).to.equal(sets.length + 1);
    });

    it('should add a default filter item to the set list', function () {
        expect(AvailableFilterCtrl.sets.list[0].key).to.be.null;
        expect(AvailableFilterCtrl.sets.list[1]).to.deep.equal(sets[0]);
    });

    it('should set the current active set filter to the default value', function () {
        expect(AvailableFilterCtrl.sets.active).to.deep.equal({key: null, value: ''});
    });

    it('should load a list of tags to populate the tag filter', function () {
        expect(AvailableFilterCtrl.tags.list.length).to.equal(tags.length + 1);
    });

    it('should add a default filter item to the tag list', function () {
        expect(AvailableFilterCtrl.tags.list[0].key).to.be.null;
        expect(AvailableFilterCtrl.tags.list[1]).to.deep.equal(tags[0]);
    });

    it('should set the current active tag filter to the default value', function () {
        expect(AvailableFilterCtrl.tags.active).to.deep.equal({key: null, value: ''});
    });

    it('should set the filter to fully loaded', function () {
        expect(AvailableFilterCtrl.loaded).to.be.true;
    });

});

describe('Unit: AvailableCtrl initialization without a set host', function() {

    var AvailableFilterCtrl,
        httpBackend,
        EVENTS,
        scope,
        host,
        environments,
        sets,
        tags;


    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, config, _host_, environment, environmentServiceMock, setServiceMock, tagServiceMock) {
        scope = $rootScope.$new();
        EVENTS = _EVENTS_;
        httpBackend = $httpBackend;
        environments = environmentServiceMock.environments;
        sets = setServiceMock.sets;
        tags = tagServiceMock.tags;
        host = _host_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app/info').respond(200);
        $httpBackend.expectGET('/environment/list').respond(200, environments);
        config.load().then(function() {
            environment.load().then(function() {
                AvailableFilterCtrl = $controller('AvailableFilterCtrl', {$scope: scope});
            });
        });
        $httpBackend.flush();
    }));

    it('should not be able to load a list of sets and use an empty set list instead', function () {
        expect(AvailableFilterCtrl.sets.list.length).to.equal(1);
    });

    it('should not be able to load a list of tags and use an empty tag list instead', function () {
        expect(AvailableFilterCtrl.tags.list.length).to.equal(1);
    });

    it('should set its loaded indication to remain undefined initially', function () {
        expect(AvailableFilterCtrl.loaded).to.be.undefined;
    });

    it('should respond to a host updated event by loading the sets and tags for that host', function () {
        httpBackend.expectGET('/set/list').respond(200, sets);
        httpBackend.expectGET('/tag/list').respond(200, tags);
        host.setHost({address: ''});
        scope.$broadcast(EVENTS.HOST_UPDATED,{});
        httpBackend.flush();
        expect(AvailableFilterCtrl.sets.list.length).to.equal(sets.length + 1);
        expect(AvailableFilterCtrl.tags.list.length).to.equal(tags.length + 1);
    });


});
