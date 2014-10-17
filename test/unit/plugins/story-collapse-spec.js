/*global StoryExpandCollapse:false */
/*global $:false */

/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Story collapse jquery plugin', function() {

    var $list,
        expand;

    beforeEach(function() {
        var template  = '<ul>';
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
        $list = $(template);
        expand = new StoryExpandCollapse($list);
        expand.setup();
    });

    it('should be able to expand and collapse all collections collectively', function () {
        expand.toggleAll();
        expect($list.hasClass('expand')).to.be.true;
        expand.toggleAll();
        expect($list.hasClass('expand')).to.be.false;
    });

    it('should be able expand all stories in a single collection', function () {
        $list.find('i[data-toggle="collection"]:first').click();
        expect($list.find('ul.expand').length).to.equal(1);
        $list.find('i[data-toggle="collection"]:last').click();
        expect($list.find('ul.expand').length).to.equal(2);
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
        expand.toggleAll();
        expect($list.find('ul.expand').length).to.equal(0);
    });

    it('should be able collapse all stories at once when stories were opened individually', function () {
        $list.find('i[data-toggle="story"]:first').click();
        expand.toggleAll();
        expect($list.find('li.expand').length).to.equal(0);
    });

});
