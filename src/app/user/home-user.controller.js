(function() {
    "use strict";

    angular.module("app.user")
        .controller("HomeUserController", HomeUserController);

    HomeUserController.$inject = [];

    function HomeUserController() {
        var vm = this;
    }
})();