(function() {
    "use strict";

    angular.module("app.user")
        .controller("UserResultsController", UserResultsController);

    UserResultsController.$inject = [];

    function UserResultsController() {
        var vm = this;
    }
})();