/**
 * Created by marc.fokkert on 13-3-2015.
 */
angular.module('finqApp.service')
    .service('storyEdit', function (story, storyVariable, config) {
        var storyList = [];

        this.getStory = getStory;
        this.isDirty = isDirty;
        this.cancel = cancel;
        this.apply = apply;

        function getStory(storyId) {
            var foundStory = getStoryFromList(storyId);
            if (foundStory !== null){
                return foundStory.working;
            }
            var originalStory = story.findStoryById(storyId);
            foundStory = {
                id: storyId,
                original: originalStory,
                working: cloneAndParse(originalStory)
            };
            addStoryToList(foundStory);
            return foundStory.working;
        }

        function addStoryToList(story){
            var maxCachedItems = config.client().editor.maxStoryCache;
            if (storyList > 0 && !isDirty(storyList.peek().id)){
                storyList.pop(); // Remove last item if pristine
            }
            if (storyList.length == maxCachedItems){
                storyList.shift(); // Remove first item if storyList gets too large
            }
            storyList.push(story);
        }

        /**
         * @return {*}
         */
        function getStoryFromList(storyId){
            for (var i = 0; i < storyList.length; i++) {
                if (storyList[i].id === storyId) {
                    return storyList[i];
                }
            }
            return null;
        }

        /**
         * Uses JSON stringify to compare working against original, returns true if changed
         * @param {number} storyId
         * @return {boolean} dirty
         */
        function isDirty(storyId){
            var foundStory = getStoryFromList(storyId);
            if (foundStory === null){
                return false; // no 'working' entry, so unchanged
            }
            return !(JSON.stringify(foundStory.original) === JSON.stringify(foundStory.working));
        }

        /**
         * Deep extend/copy
         * @param {object} b Object to be used as source
         * @param {object} [a={}] Object to be used as destination
         * @returns {*}
         */
        function cloneAndParse(b, a) {
            a = a || {};
            var workingStory = angular.extend(a, b);
            storyVariable.setupVariables(workingStory);
            return workingStory;
        }

        /**
         * Shallow extend/copy
         * @param a {object} Object to be used as destination
         * @param b {object} Object to be used as source
         */
        function merge(a, b) {
            angular.merge(a, b);
        }

        /**
         * Creates a clean working copy from the original story
         * @param {number} storyId
         */
        function cancel(storyId){
            var story = getStoryFromList(storyId);
            cloneAndParse(story.original, story.working);
        }

        /**
         * Apply changes from the working copy to the original story
         * @param {number} storyId
         */
        function apply(storyId){
            var story = getStoryFromList(storyId);
            merge(story.original, story.working);
            // TODO add persistence
        }
    });
