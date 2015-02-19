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
        }
    });
};