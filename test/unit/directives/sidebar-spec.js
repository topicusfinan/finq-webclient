/**
 * Created by marc.fokkert on 6-3-2015.
 */
describe('Unit: sidebar', function () {
    beforeEach(module('finqApp'));
    var element, scope, sidebar;

    beforeEach(inject(function ($rootScope, $compile) {
        var template = '<div sidebar></div>';
        scope = $rootScope;
        element = $compile(template)(scope);
    }));

    beforeEach(inject(function(_sidebar_){
        sidebar = _sidebar_;
    }));

    it('should inject code it has been provided with', function(){
        sidebar.setDirective({'test':'foo'});
        scope.$apply();
        expect(sidebar.hasSidebar()).to.be.true();
        expect(element.find('aside').attr('test')).to.equal('bag["test"]');
    });

    it('should clear code', function(){
        sidebar.setDirective({test:''});
        scope.$apply();
        sidebar.clean();
        scope.$apply();
        expect(sidebar.hasSidebar()).to.be.false();
        expect(element.children().length).to.equal(0);
    });

});
