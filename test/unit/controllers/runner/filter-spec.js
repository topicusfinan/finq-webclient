/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrlFilter initialization', function() {

    var AvailableFilterCtrl,
        EVENTS,
        scope,
        sets,
        tags;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, config, setServiceMock, tagServiceMock) {
        scope = $rootScope.$new();
        EVENTS = _EVENTS_;
        sets = setServiceMock.sets;
        tags = tagServiceMock.tags;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app/info').respond(200);
        $httpBackend.expectGET('/set/list').respond(200, sets);
        $httpBackend.expectGET('/tag/list').respond(200, tags);
        config.load().then(function() {
            AvailableFilterCtrl = $controller('AvailableFilterCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

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
