/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: UtilsService time elapsed determination', function() {

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

describe('Unit: UtilsService pluralization', function() {

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

    it('should be able to pluralize based on a simple interpretation value', function () {
        var pluralized = utilsService.pluralize(2);
        expect(pluralized.template).to.equal('PLURAL');
        pluralized = utilsService.pluralize(2, 2);
        expect(pluralized.template).to.equal('SINGULAR');
    });

    it('should be able to pluralize a zero value based on a simple interpretation value', function () {
        var pluralized = utilsService.pluralize(0);
        expect(pluralized.template).to.equal('PLURAL');
    });

    it('should be able to pluralize a lowest level value of a complex template set', function () {
        var pluralized = utilsService.pluralize(35, [
            {actionValue: 1, target: 'SECONDS'},
            {actionValue: 60, target: 'MINUTES'},
            {actionValue: 3600, target: 'HOURS'}
        ]);
        expect(pluralized.template).to.equal('SECONDS.PLURAL');
        expect(pluralized.value).to.equal(35);
    });

    it('should be able to pluralize a zero value value of a complex template set', function () {
        var pluralized = utilsService.pluralize(0, [
            {actionValue: 1, target: 'SECONDS'},
            {actionValue: 60, target: 'MINUTES'},
            {actionValue: 3600, target: 'HOURS'}
        ]);
        expect(pluralized.template).to.equal('SECONDS.PLURAL');
        expect(pluralized.value).to.equal(0);
    });

    it('should be able to pluralize a center value of a complex template set', function () {
        var pluralized = utilsService.pluralize(135, [
            {actionValue: 1, target: 'SECONDS'},
            {actionValue: 60, target: 'MINUTES'},
            {actionValue: 3600, target: 'HOURS'}
        ]);
        expect(pluralized.template).to.equal('MINUTES.PLURAL');
        expect(pluralized.value).to.equal(2);
    });

    it('should be able to singularize a top level value of a complex template set', function () {
        var pluralized = utilsService.pluralize(3700, [
            {actionValue: 1, target: 'SECONDS'},
            {actionValue: 60, target: 'MINUTES'},
            {actionValue: 3600, target: 'HOURS'}
        ]);
        expect(pluralized.template).to.equal('HOURS.SINGULAR');
        expect(pluralized.value).to.equal(1);
    });

});
