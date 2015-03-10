///**
// * Created by marc.fokkert on 2-3-2015.
// */
//'use strict';
//
//describe('Unit: Edit-span directive', function () {
//    beforeEach(module('finqApp'));
//
//    var element, scope;
//    var span, input;
//    var modelText = "foo";
//
//    beforeEach(module('views/modules/writer/directives/edit-span.html'));
//
//
//    beforeEach(inject(function ($rootScope, $compile) {
//        var template = angular.element('<div><edit-span model="model"></edit-span></div>');
//
//        scope = $rootScope;
//        scope.model = modelText;
//        $compile(template)(scope);
//        scope.$digest();
//        element = $(template);
//        span = element.first('span');
//        input = element.first('input');
//    }));
//
//    it('should show a span with the model', function () {
//        var text = span.text().trim();
//        expect(text).to.equal(modelText);
//    });
//
//    it('should have an input field bound to the model', function(){
//        var value = input.text().trim();
//        expect(value).to.equal(modelText);
//    });
//
//    it('should initially show span', function(){
//        expect(input.css('display')).to.equal('none');
//    })
//
//
//
//});
