module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'sinon-chai'],
        browsers: ['PhantomJS'],
        singleRun: true,
        coverageReporter: {
            type : 'lcov',
            dir : 'reports/coverage/'
        },
        reporters: ['progress', 'coverage']
    });
};
