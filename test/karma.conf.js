module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'sinon-chai'],
        coverageReporter: {
            type : 'lcov',
            dir : 'test/reports/coverage/'
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/'
        },
        reporters: ['progress', 'coverage']
    });
};
