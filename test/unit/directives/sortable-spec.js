'use strict';
/**
 * Created by marc.fokkert on 3-4-2015.
 */


describe('Unit: Sortable directive', function () {
    beforeEach(module('finqApp'));
    var element, scope;
    var collection;
    var sortableObjects = {};
    var handle, connectWith;

    beforeEach(function () {
        collection = [['li1', 'li2'], []];
        handle = 'handle';
        connectWith = 'connect-with';

        inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            scope.collection = collection;
            scope.connectWith = connectWith;
            scope.handle = handle;

            var template = '<div>' +
                '<ul id="sortable{{$index}}" ng-repeat="subCol in collection" sortable="subCol" connect-with=".{{connectWith}}" handle=".{{handle}}" ng-class="$index === 0 ? connectWith :  \'\'">' +
                '   <li ng-repeat="id in subCol" id="{{id}}" class="{{handle}}" ></li>' +
                '</ul>';

            element = $compile(template)(scope);

            // Override sortable to get the options object
            $.widget('ui.sortable', {
                _create: function () {
                    sortableObjects[this.element] = this.options;
                }
            });

            scope.$digest();
        });
    });

    it('should record the starting index of the element', function () {
        var li1 = element.find('#li1');
        var ui = {item: li1};
        li1.scope().sortableObjectStart(undefined, ui);

        expect(li1.scope().start).is.equal(li1.index());
    });

    it('should move objects within the same sortable', inject(function ($arrayOperations) {
        sinon.spy($arrayOperations, 'moveItem');

        var li1 = element.find('#li1');
        var sortable0 = element.find('#sortable0');
        var ui = {item: li1, sender: null};

        // Start sort
        sortable0.scope().sortableObjectStart(undefined, ui);

        // Emulate element movement
        li1.detach().appendTo(sortable0);

        // End sort
        sortable0.scope().sortableObjectEnd(undefined, ui, sortable0);

        expect($arrayOperations.moveItem).to.be.calledWith(collection[0], 0, 1);
    }));

    it('should move objects between sortables', inject(function ($arrayOperations) {
        sinon.spy($arrayOperations, 'removeItem');
        sinon.spy($arrayOperations, 'insertItem');

        var li1 = element.find('#li1');
        var sortable0 = element.find('#sortable0');
        var sortable1 = element.find('#sortable1');
        var ui = {item: li1, sender: null};

        // Start sort
        sortable0.scope().sortableObjectStart(undefined, ui);

        // Emulate element movement
        li1.detach().appendTo(sortable1);

        // End sort (1)
        sortable0.scope().sortableObjectEnd(undefined, ui, sortable0);
        ui.sender = sortable1;

        // End sort (2)
        sortable1.scope().sortableObjectEnd(undefined, ui, sortable1);
        scope.$digest();

        expect($arrayOperations.removeItem).to.be.calledOnce;
        expect($arrayOperations.insertItem).to.be.calledOnce;
        expect(collection[0].length).to.equal(1);
        expect(collection[1].length).to.equal(1);
    }));

    it('should integrate with JQueryUI', function () {
        var sortable1 = element.find('#sortable1');
        var sortableObject = sortableObjects[sortable1];

        var sortableObjectStart = sinon.stub(sortable1.scope(), 'sortableObjectStart');
        var sortableObjectEnd = sinon.stub(sortable1.scope(), 'sortableObjectEnd');
        var setClasses = sinon.stub(sortable1.scope(), 'setClasses');
        var removeClasses = sinon.stub(sortable1.scope(), 'removeClasses');

        // Start
        sortableObject.start();
        expect(sortableObjectStart).to.be.calledOnce;
        expect(setClasses).to.be.calledOnce;

        sortableObjectStart.reset();
        setClasses.reset();

        // Update
        sortableObject.update();
        expect(sortableObjectEnd).to.be.calledOnce;
        expect(removeClasses).to.be.calledOnce;

        sortableObjectEnd.reset();
        removeClasses.reset();

        // Stop
        sortableObject.stop();
        expect(removeClasses).to.be.calledOnce;

        // Static properties
        expect(sortableObject.connectWith.selector).to.equal('.' + connectWith);
        expect(sortableObject.handle).to.equal('.' + handle);
    });

    it('should attach sorting class when sorting', function () {
        var sortable0 = element.find('#sortable0');
        var sortable1 = element.find('#sortable1');
        var sorting = 'sorting';

        sortable0.scope().setClasses(sortable0, '.' + connectWith);
        expect(sortable0.hasClass(sorting)).to.be.true();
        expect(sortable1.hasClass(sorting)).to.be.false();

        sortable0.scope().removeClasses(sortable0, '.' + connectWith);
        expect(sortable0.hasClass(sorting)).to.be.false();
        expect(sortable1.hasClass(sorting)).to.be.false();

        sortable1.scope().setClasses(sortable1, '.' + connectWith);
        expect(sortable0.hasClass(sorting)).to.be.true();
        expect(sortable1.hasClass(sorting)).to.be.true();

        sortable1.scope().removeClasses(sortable1, '.' + connectWith);
        expect(sortable0.hasClass(sorting)).to.be.false();
        expect(sortable1.hasClass(sorting)).to.be.false();
    })


});
