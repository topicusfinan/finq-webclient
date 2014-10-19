/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: UtilsService', function() {

    var utilsService,
        currentTime,
        adjustedTime;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function (utils) {
        utilsService = utils;
        currentTime = new Date();
        adjustedTime = new Date();
    }));

    it('should be able to calculate a second based elapse time indication', function () {
        adjustedTime.setSeconds(adjustedTime.getSeconds() + 9);
        var timeElapsed = utilsService.getTimeElapsed(adjustedTime,currentTime);
        expect(timeElapsed).to.equal('00:09');
    });

    it('should be able to calculate a minute based elapse time indication', function () {
        adjustedTime.setSeconds(adjustedTime.getSeconds() + 100);
        var timeElapsed = utilsService.getTimeElapsed(adjustedTime,currentTime);
        expect(timeElapsed).to.equal('01:40');
    });

    it('should be able to calculate an hour based elapse time indication', function () {
        adjustedTime.setSeconds(adjustedTime.getSeconds() + 3745);
        var timeElapsed = utilsService.getTimeElapsed(adjustedTime,currentTime);
        expect(timeElapsed).to.equal('01:02:25');
    });

});
