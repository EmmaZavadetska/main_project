(function() {
    "use strict";

    angular.module("app.user")
        .controller("TestPlayerController", TestPlayerController);

    TestPlayerController.$inject = [];

    function TestPlayerController() {
        var vm = this;
    }
})();