module.exports = function(config) {

    config.set({
        basePath: "",

        files: ["./bower_components/angular/angular.js",
            "./node_modules/angular-mocks/angular-mocks.js",
            ".tmp/js/app.js"],

        exclude: [],

        plugins: ["karma-jasmine", "karma-chrome-launcher"],

        preprocessors: {},

        reporters: ["progress", "karma-coverage", "karma-htmlfile-reporter"],

        port: 9876,

        colors: true,

        autoWatch: true,

        browsers: ["Chrome"],

        singleRun: false
    });
};
