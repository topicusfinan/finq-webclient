/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunUtils service', function() {

    var runUtilsService,
        STATE;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($runUtils,_STATE_) {
        runUtilsService = $runUtils;
        STATE = _STATE_;
    }));

    it('should be able to determine a failed status and percentage depending on progress input', function () {
        var item = {
            status: STATE.RUN.SCENARIO.FAILED
        };
        runUtilsService.calculateProgress(item,5,10);
        expect(item.percentage).to.equal(48);
        expect(item.highlight).to.equal('failed');
    });

    it('should be able to determine a success status and percentage depending on progress input', function () {
        var item = {
            status: STATE.RUN.SCENARIO.SUCCESS
        };
        runUtilsService.calculateProgress(item,10,10);
        expect(item.percentage).to.equal(100);
        expect(item.highlight).to.equal('success');
    });

    it('should be able to determine a queued status and percentage depending on progress input', function () {
        var item = {
            status: STATE.RUN.SCENARIO.QUEUED
        };
        runUtilsService.calculateProgress(item,8,10);
        expect(item.percentage).to.equal(80);
        expect(item.highlight).to.equal('queued');
    });

    it('should be able to determine a skipped status and percentage depending on progress input', function () {
        var item = {
            status: STATE.RUN.SCENARIO.SKIPPED
        };
        runUtilsService.calculateProgress(item,10,10);
        expect(item.percentage).to.equal(100);
        expect(item.highlight).to.equal('skipped');
    });

    it('should be able to determine a blocked status and percentage depending on progress input', function () {
        var item = {
            status: STATE.RUN.SCENARIO.BLOCKED
        };
        runUtilsService.calculateProgress(item,6,10);
        expect(item.percentage).to.equal(60);
        expect(item.highlight).to.equal('blocked');
    });

    it('should be able to determine a default status and percentage depending on progress input', function () {
        var item = {
            status: STATE.RUN.SCENARIO.RUNNING
        };
        runUtilsService.calculateProgress(item,2,10);
        expect(item.percentage).to.equal(20);
        expect(item.highlight).to.equal('none');
    });

});
