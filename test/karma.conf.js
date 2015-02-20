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
            'build/scripts/controllers/**/*.js': ['coverage'],
            'build/scripts/directives/**/*.js': ['coverage'],
            'build/scripts/filters/**/*.js': ['coverage'],
            'build/scripts/modules/*/**/*.js': ['coverage'],
            'build/scripts/services/**/*.js': ['coverage']
        }
    });
};
