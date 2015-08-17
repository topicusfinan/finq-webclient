/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ReportFilterCtrl', function() {

    var ReportFilterCtrl,
        scope,
        STATE;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $config, _STATE_) {
        scope = $rootScope.$new();
        STATE = _STATE_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app').respond(200);
        $config.load().then(function() {
            ReportFilterCtrl = $controller('ReportFilterCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should load a select list of states to populate the state filter', function () {
        expect(ReportFilterCtrl.statuses).to.deep.equal([
            {key: STATE.RUN.SCENARIO.SUCCESS, value: ''},
            {key: STATE.RUN.SCENARIO.FAILED, value: ''}
        ]);
    });

});
