module.exports = function(config) {
    config.set({
        browsers: ['Chrome', 'Firefox'],
        files: ['test/**/*.js'],
        frameworks: ['browserify', 'mocha'],
        preprocessors: {
            'test/**/*.js': ['browserify']
        },
        reporters: ['mocha'],
        singleRun: true,

        browserify: {
            debug: true,
            transform: ['babelify']
        },

        client: {
            mocha: {
                grep: '@nodeonly',
                invert: true
            }
        }
    });
};
