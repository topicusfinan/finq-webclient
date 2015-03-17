/*global $:false */
'use strict';
/**
 * Created by marc.fokkert on 17-3-2015.
 */
angular.module('finqApp.directive')
    .directive('storyCollapse', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var $list = $(element);
                scope.toggleAll = toggleAll;
                scope.toggleStory = toggleStory;
                scope.toggleBook = toggleBook;

                setup();

                function toggleAll() {
                    var $expandedStoriesOrBooks = $list.find('ul.expand,li.expand');
                    if ($expandedStoriesOrBooks.length !== 0) {
                        $expandedStoriesOrBooks.removeClass('expand');
                    } else {
                        $list.find('li li').toggleClass('expand');
                    }
                }

                function setup() {
                    $list.on('click touchend','[data-toggle="story"]',function() {
                        toggleStory($(this));
                    });
                    $list.on('click touchend','[data-toggle="collection"]',function() {
                        toggleBook($(this));
                    });
                }

                function toggleStory($storyTrigger) {
                    var $story = $storyTrigger.closest('li');
                    $story.toggleClass('expand');
                }

                function toggleBook($bookTrigger) {
                    var $expandedStories = $bookTrigger.closest('li').find('li.expand');
                    if ($expandedStories.length !== 0) {
                        $expandedStories.removeClass('expand');
                    } else {
                        $bookTrigger.closest('li').children('ul').children().toggleClass('expand');
                    }
                }

            }
        };
    });
