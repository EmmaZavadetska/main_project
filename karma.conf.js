module.exports = function(config) {

    config.set({
        basePath: "",

        frameworks: ["jasmine"],

        files: ["./bower_components/angular/angular.js",
            "./node_modules/angular-mocks/angular-mocks.js",
            ".tmp/js/app.js",
            "./src/**/*.spec.js"],

        exclude: [],

        plugins: ["karma-jasmine", "karma-chrome-launcher", "karma-htmlfile-reporter"],

        preprocessors: {},

        reporters: ["progress", "coverage", "html"],

        port: 9876,

        colors: true,

        autoWatch: true,

        browsers: ["Chrome"],

        singleRun: false
    });
};
