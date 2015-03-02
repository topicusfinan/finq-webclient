'use strict';

/**
 * Created by c.kramer on 8/15/2014.
 */
angular.module('finqApp.writer', [
    'ngRoute',
    'finqApp.writer.service',
    'finqApp.writer.controller',
    'finqApp.writer.filter',
    'finqApp.writer.directive'
]).config(function ($routeProvider) {
    $routeProvider.when('/writer/stories', {
        templateUrl: '/views/modules/writer/stories.html',
        controller: 'StoriesCtrl',
        controllerAs: 'stories'
    }).when('/writer/stories/new', {
        templateUrl: '/views/modules/writer/story.html',
        controller: 'StoryCtrl',
        controllerAs: "story"
    }).when('/writer/stories/:storyId', {
        templateUrl: '/views/modules/writer/story.html',
        controller: 'StoryCtrl',
        controllerAs: "story"
    }).when('/writer/steps', {
        templateUrl: '/views/modules/writer/steps.html',
        controller: 'StepsCtrl',
        controllerAs: "steps"
    }).when('/writer', {
        redirectTo: '/writer/stories'
    });
});

angular.module('finqApp.writer.service', []);
angular.module('finqApp.writer.controller', []);
angular.module('finqApp.writer.filter', []);
angular.module('finqApp.writer.directive', []);
