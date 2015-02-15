// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-08-13 using
// generator-karma 0.8.3

module.exports = function() {
    'use strict';

    return {
        autoWatch: true,
        singleRun: false,
        colors: true,
        basePath: '../',
        frameworks: ['mocha', 'sinon-chai'],
        browsers: ['PhantomJS'],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-sinon-chai',
            'karma-coverage',
            'chai-as-promised'
        ],
        coverageReporter: {
            type : 'lcov',
            dir : 'reports/coverage/'
        },
        reporters: ['progress', 'coverage'],

        preprocessors: {
            'app/scripts/controllers/**/*.js': ['coverage'],
            'app/scripts/directives/**/*.js': ['coverage'],
            'app/scripts/filters/**/*.js': ['coverage'],
            'app/scripts/modules/*/**/*.js': ['coverage'],
            'app/scripts/services/**/*.js': ['coverage']
        },

        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-translate/angular-translate.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/typeahead.js/dist/typeahead.bundle.js',
            'bower_components/angular-md5/angular-md5.js',
            'app/scripts/*.js',
            'app/scripts/modules/*.js',
            'app/scripts/modules/**/*.js',
            'app/scripts/constants/**/*.js',
            'app/scripts/directives/**/*.js',
            'app/scripts/services/**/*.js',
            'app/scripts/controllers/**/*.js',
            'app/scripts/filters/**/*.js',
            'app/scripts/plugins/**/*.js',
            'app/scripts/mockdata/**/*.js'
        ],

        client: {
            mocha: {
                ui: 'tdd'
            }
        }

    };
};
