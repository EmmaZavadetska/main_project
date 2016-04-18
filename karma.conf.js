module.exports = function(config) {

    config.set({
        basePath: "./",

        frameworks: ["jasmine"],

        files: [],

        exclude: [],

        plugins: ["karma-jasmine", "karma-chrome-launcher"],

        preprocessors: {},

        reporters: ["karma-htmlfile-reporter"],

        port: 9876,

        colors: true,

        autoWatch: true,

        browsers: ["Chrome"],

        singleRun: false
    });
};
