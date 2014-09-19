'use strict';

describe('Unit: FilterSelect directive controller', function() {
    var FilterSelectCtrl,
        EVENTS,
        rootScope,
        scope;

    beforeEach(function() {
        module('finqApp');
    });
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        EVENTS = _EVENTS_;
        FilterSelectCtrl = $controller('FilterSelectCtrl', {$scope: scope});
        scope.active = [{
            key: 0,
            value: 'test'
        }];
        scope.passedOptions = scope.options = [{
            key: 0,
            value: 'test'
        }, {
            key: 1,
            value: 'test2'
        }];
        scope.id = 'selectId';
    }));

    it('should initially be collapsed', function() {
        expect(scope.show).to.be.false;

    });

    it('should toggle between collapsed and expanded', function() {
        scope.toggle();
        expect(scope.show).to.be.true;
        scope.toggle();
        expect(scope.show).to.be.false;
    });

    it('should delay a request to hide the selection dropdown', function() {
        scope.toggle();
        scope.hide();
        expect(scope.show).to.be.true;
    });

    it('should select only the target in case of a single select', function() {
        var emitSpy = sinon.spy(scope, '$emit');
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.active[0].key).to.equal(scope.options[1].key);
        expect(scope.active[0].value).to.equal(scope.options[1].value);
        expect(emitSpy).to.have.been.calledWith(EVENTS.FILTER_SELECT_UPDATED,{
            id: scope.id,
            keys: [scope.active[0].key]
        });
    });

    it('should keep the current target selected in case it is selected again with a single select', function() {
        scope.select(scope.options[1].key,scope.options[1].value);
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.active[0].key).to.equal(scope.options[1].key);
        expect(scope.active[0].value).to.equal(scope.options[1].value);
    });

    it('should select both targets in case of a multiple select', function() {
        var emitSpy = sinon.spy(scope, '$emit');
        scope.multiple = true;
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.active.length).to.equal(2);
        expect(scope.active[0].key).to.equal(scope.options[0].key);
        expect(scope.active[0].value).to.equal(scope.options[0].value);
        expect(scope.active[1].key).to.equal(scope.options[1].key);
        expect(scope.active[1].value).to.equal(scope.options[1].value);
        expect(scope.value).to.equal(scope.active[0].value+', '+scope.active[1].value);
        expect(emitSpy).to.have.been.calledWith(EVENTS.FILTER_SELECT_UPDATED,{
            id: scope.id,
            keys: [scope.active[0].key,scope.active[1].key]
        });
    });

    it('should allow the cancelling of a secondary selected option in case of a multiple select', function() {
        scope.multiple = true;
        scope.select(scope.options[1].key,scope.options[1].value);
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.active.length).to.equal(1);
        expect(scope.active[0].key).to.equal(scope.options[0].key);
        expect(scope.active[0].value).to.equal(scope.options[0].value);
        expect(scope.value).to.equal(scope.active[0].value);
    });

    it('should deactivate the placeholder in case the any other option is selected in a multiple select', function() {
        scope.multiple = true;
        scope.options = [{
            key: null,
            value: 'placeholder'
        }].concat(scope.options);
        scope.select(scope.options[0].key,scope.options[0].value);
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.active.length).to.equal(1);
        expect(scope.active[0].key).to.equal(scope.options[1].key);
        expect(scope.active[0].value).to.equal(scope.options[1].value);
        expect(scope.value).to.equal(scope.active[0].value);
    });

    it('should block the cancelling of a primary selected option in case of a multiple select', function() {
        scope.multiple = true;
        scope.select(scope.options[1].key,scope.options[1].value);
        scope.select(scope.options[0].key,scope.options[0].value);
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.active.length).to.equal(1);
        expect(scope.active[0].key).to.equal(scope.options[1].key);
        expect(scope.active[0].value).to.equal(scope.options[1].value);
        expect(scope.value).to.equal(scope.active[0].value);
    });

    it('should block the cancelling of a primary selected option in case of a single select', function() {
        scope.multiple = true;
        scope.select(scope.options[0].key,scope.options[0].value);
        expect(scope.active.length).to.equal(1);
        expect(scope.active[0].key).to.equal(scope.options[0].key);
        expect(scope.active[0].value).to.equal(scope.options[0].value);
        expect(scope.value).to.equal(scope.active[0].value);
    });

    it('should mark a selected item as active in case of a single select', function() {
        expect(scope.isActive(scope.options[0].key)).to.be.true;
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.isActive(scope.options[0].key)).to.be.false;
        expect(scope.isActive(scope.options[1].key)).to.be.true;
    });

    it('should mark a selected items as active in case of a multiple select', function() {
        scope.multiple = true;
        expect(scope.isActive(scope.options[0].key)).to.be.true;
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.isActive(scope.options[0].key)).to.be.true;
        expect(scope.isActive(scope.options[1].key)).to.be.true;
    });

    it('should automatically select the placeholder in case no other option is active in a multiple select', function() {
        scope.multiple = true;
        scope.options = [{
            key: null,
            value: 'placeholder'
        }].concat(scope.options);
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(scope.isActive(scope.options[0].key)).to.be.true;
        expect(scope.isActive(scope.options[1].key)).to.be.false;
    });

    it('should automatically unselect any other option in case a placeholder is selected in a multiple select', function() {
        scope.multiple = true;
        scope.options = [{
            key: null,
            value: 'placeholder'
        }].concat(scope.options);
        scope.select(scope.options[2].key,scope.options[2].value);
        expect(scope.isActive(scope.options[1].key)).to.be.true;
        expect(scope.isActive(scope.options[2].key)).to.be.true;
        scope.select(scope.options[0].key,scope.options[0].value);
        expect(scope.isActive(scope.options[0].key)).to.be.true;
        expect(scope.isActive(scope.options[1].key)).to.be.false;
        expect(scope.isActive(scope.options[2].key)).to.be.false;
    });

    it('should add the placeholder to the options list during initialization in case a placeholder was provided', function() {
        scope.placeholder = 'test';
        scope.initialize();
        expect(scope.options[0]).to.deep.equal({key: null, value: ''});
    });

    it('should set the placeholder as the active value during initialization in case a placeholder was provided', function() {
        scope.placeholder = 'test';
        scope.initialize();
        expect(scope.active[0]).to.deep.equal({key: null, value: ''});
    });

    it('should select the default value during initialization if it was provided', function() {
        scope.defkey = 1;
        scope.initialize();
        expect(scope.active[0]).to.deep.equal(scope.options[1]);
    });

    it('should throw an error during initialization in case neither a placeholder nor a default value was set', function() {
        var error;
        try {
            scope.initialize();
        } catch (err) {
            error = err;
        }
        expect(error).to.not.be.undefined;
    });

    it('should throw an error during initialization in case an invalid default key was provided', function() {
        var error;
        scope.defkey = 2;
        try {
            scope.initialize();
        } catch (err) {
            error = err;
        }
        expect(error).to.not.be.undefined;
    });

    it('should synchronize itself with pushed keys', function() {
        scope.synchronize([scope.options[0].key,scope.options[1].key]);
        expect(scope.active[0].key).to.equal(scope.options[0].key);
        expect(scope.active[0].value).to.equal(scope.options[0].value);
        expect(scope.active[1].key).to.equal(scope.options[1].key);
        expect(scope.active[1].value).to.equal(scope.options[1].value);
    });

    it('should broadcast a synchronization event in case it is configured to do so', function() {
        scope.synchronizeById = 'test';
        var broadcastSpy = sinon.spy(rootScope, '$broadcast');
        scope.select(scope.options[1].key,scope.options[1].value);
        expect(broadcastSpy).to.have.been.calledWith(EVENTS.SYNCHRONIZE_FILTER,{
            id: scope.id,
            keys: [scope.active[0].key]
        });
    });

});
