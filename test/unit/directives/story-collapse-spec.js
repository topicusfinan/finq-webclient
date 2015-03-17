/*global StoryExpandCollapse:false */
/*global $:false */

/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Story collapse jquery plugin', function() {
    beforeEach(module('finqApp'));

    var $list,
        scope;

    beforeEach(inject(function($rootScope, $compile) {
        var template  = '<ul story-collapse>';
            template += '   <li>';
            template += '       <i data-toggle="collection"></i>';
            template += '       <ul>';
            template += '           <li>';
            template += '               <i data-toggle="story"></i>';
            template += '               <ul></ul>';
            template += '           </li>';
            template += '           <li>';
            template += '               <i data-toggle="story"></i>';
            template += '               <ul></ul>';
            template += '           </li>';
            template += '       </ul>';
            template += '   </li>';
            template += '   <li>';
            template += '       <i data-toggle="collection"></i>';
            template += '       <ul>';
            template += '           <li>';
            template += '               <i data-toggle="story"></i>';
            template += '               <ul></ul>';
            template += '           </li>';
            template += '           <li>';
            template += '               <i data-toggle="story"></i>';
            template += '               <ul></ul>';
            template += '           </li>';
            template += '       </ul>';
            template += '   </li>';
            template += '</ul>';

        scope = $rootScope;
        var element = $compile(template)(scope);
        $list = $(element);
    }));

    it('should be able to expand and collapse all collections collectively', function () {
        scope.toggleAll();
        expect($list.find('li.expand').length).to.equal(4);
        scope.toggleAll();
        expect($list.find('li.expand').length).to.equal(0);
    });

    it('should be able expand all stories in a single collection', function () {
        $list.find('i[data-toggle="collection"]:first').click();
        expect($list.find('li.expand').length).to.equal(2);
        $list.find('i[data-toggle="collection"]:last').click();
        expect($list.find('li.expand').length).to.equal(4);
    });

    it('should be able expand a single story', function () {
        $list.find('i[data-toggle="story"]:first').click();
        expect($list.find('li.expand').length).to.equal(1);
        $list.find('i[data-toggle="story"]:last').click();
        expect($list.find('li.expand').length).to.equal(2);
    });

    it('should be able collapse all stories in a single collection', function () {
        $list.find('i[data-toggle="collection"]:first').click();
        $list.find('i[data-toggle="collection"]:first').click();
        expect($list.find('ul.expand').length).to.equal(0);
    });

    it('should be able collapse all stories at once when collections were opened individually', function () {
        $list.find('i[data-toggle="collection"]:first').click();
        scope.toggleAll();
        expect($list.find('ul.expand').length).to.equal(0);
    });

    it('should be able collapse all stories at once when stories were opened individually', function () {
        $list.find('i[data-toggle="story"]:first').click();
        scope.toggleAll();
        expect($list.find('li.expand').length).to.equal(0);
    });

    it('should be able collapse a story after all stories were opened in a single collection', function () {
        $list.find('i[data-toggle="collection"]:first').click();
        $list.find('i[data-toggle="story"]:first').click();
        expect($list.find('li.expand').length).to.equal(1);
    });
});
