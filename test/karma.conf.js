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
            'app/scripts/controllers/**/*.js': ['coverage'],
            'app/scripts/directives/**/*.js': ['coverage'],
            'app/scripts/filters/**/*.js': ['coverage'],
            'app/scripts/modules/*/**/*.js': ['coverage'],
            'app/scripts/services/**/*.js': ['coverage']
        }
    });
};
