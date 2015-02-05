'use strict';
/*global $:false */
/*exported StoryExpandCollapse */

/**
 * @description
 * # Story expand and collapse plugin
 *
 * Handles the ability to expand and collapse lists and sublists in a story tree.
 * @returns {StoryExpandCollapse}
 */
var StoryExpandCollapse = function (listId) {
    var $list = $(listId);

    this.toggleAll = function () {
        var $expandedStoriesOrBooks = $list.find('ul.expand,li.expand');
        if ($expandedStoriesOrBooks.length !== 0) {
            $expandedStoriesOrBooks.removeClass('expand');
        } else {
            $list.toggleClass('expand');
        }
    };

    this.setup = function () {
        $list.on('click touchend', '[data-toggle="story"]', function () {
            expandStory($(this));
        });
        $list.on('click touchend', '[data-toggle="collection"]', function () {
            toggleBook($(this));
        });
    };

    var expandStory = function ($storyTrigger) {
        var $story = $storyTrigger.closest('li');
        if (!$story.hasClass('expand')) {
            $story.addClass('expand');
        }
    };

    var toggleBook = function ($bookTrigger) {
        var $expandedStories = $bookTrigger.closest('li').find('ul.expand,li.expand');
        if ($expandedStories.length !== 0) {
            $expandedStories.removeClass('expand');
        } else {
            $bookTrigger.closest('li').children('ul').toggleClass('expand');
        }
    };

};
