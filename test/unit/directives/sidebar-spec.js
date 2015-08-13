/**
 * Created by marc.fokkert on 6-3-2015.
 */
describe('Unit: sidebar', function () {
    beforeEach(module('finqApp'));
    var element, scope, sidebar, STATE;

    beforeEach(inject(function ($rootScope, $compile) {
        var template = '<aside sidebar="false"></aside>';
        scope = $rootScope;
        element = $compile(template)(scope);
    }));

    beforeEach(inject(function($sidebar, _STATE_){
        sidebar = $sidebar;
        STATE = _STATE_;
    }));

    it('should inject code it has been provided with', function(){
        sidebar.setDirective({'test':'foo'});
        scope.$apply();
        expect(sidebar.getStatus()).to.equal(STATE.SIDEBAR.COLLAPSED);
        expect(element.find('div').attr('test')).to.equal('bag["test"]');
    });

    it('should clear code', function(){
        sidebar.setDirective({test:''});
        scope.$apply();
        sidebar.setDirective(null);
        scope.$apply();
        expect(sidebar.getStatus()).to.equal(STATE.SIDEBAR.HIDDEN);
        expect(element.children().length).to.equal(0);
    });

});
