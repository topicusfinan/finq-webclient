'use strict';

describe('Unit: AvailableFilterCtrl initialization', function() {

    var AvailableFilterCtrl,
        setService,
        tagService,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, set, tag) {
        scope = $rootScope.$new();
        setService = set;
        tagService = tag;
        $httpBackend.expectGET('/set/list').respond(200, [
                {key : 0, value : 'AAA'},
                {key : 1, value : 'BBB'}
            ]);
        $httpBackend.expectGET('/tag/list').respond(200, [
                {key : 0, value : 'XXX'},
                {key : 1, value : 'YYY'},
                {key : 1, value : 'ZZZ'}
            ]);
        $httpBackend.expectGET('/environment/list').respond(200, [
                {key : 0, value : 'KKK'},
                {key : 1, value : 'LLL'},
                {key : 1, value : 'MMM'},
                {key : 1, value : 'NNN'},
            ]);
        AvailableFilterCtrl = $controller('AvailableFilterCtrl', {$scope: scope});
        $httpBackend.flush();
    }));

    it('should initially load the set definition and tag lists', function () {
        expect(AvailableFilterCtrl.sets.list.length).to.equal(3);
        expect(AvailableFilterCtrl.tags.list.length).to.equal(4);
        expect(AvailableFilterCtrl.environments.list.length).to.equal(5);
    });

    it('should should define itself as loaded', function () {
        expect(AvailableFilterCtrl.loaded).to.be.true;
    });

});
