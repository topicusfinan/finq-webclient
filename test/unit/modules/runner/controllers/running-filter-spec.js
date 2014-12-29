/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunningFilterCtrl', function() {

    var RunningFilterCtrl,
        scope,
        environments;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, config, environmentServiceMock) {
        scope = $rootScope.$new();
        environments = environmentServiceMock.environments;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/environments').respond(200, environments);
        config.load().then(function() {
            RunningFilterCtrl = $controller('RunningFilterCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should load a list of environments to populate the environment filter', function () {
        expect(RunningFilterCtrl.environments).to.deep.equal([
            {key: environments[0].id, value: environments[0].name},
            {key: environments[1].id, value: environments[1].name},
            {key: environments[2].id, value: environments[2].name}
        ]);
    });

});
