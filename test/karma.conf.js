module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'sinon-chai'],
        browsers: ['PhantomJS'],
        singleRun: true,
        coverageReporter: {
            type : 'lcov',
            dir : 'test/reports/coverage/'
        },
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'build/scripts/**/*.js': ['coverage']
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

            'build/scripts/app.js',
            'build/scripts/modules/mock.js',
            'build/scripts/mockdata/**/*.js',
            'build/scripts/**/*.js',


            'test/unit/**/*.js'
        ]
    });
};
